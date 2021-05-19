import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import axios from "axios";
import colorlist from "../colors/colors";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ColorRamp from "../colors/colorramp";
import Stats from "three/examples/jsm/libs/stats.module.js";
import git from "./img/git.png";
import StreamLines from "../3dstreamlines/3dstreamlines";
import "./viewer.css";

class Viewer extends Component {
  state = {
    loaded: false,
    colorTitle: this.props.options.colorTitle || "spectrum",
    min: this.props.options.min || 0,
    max: this.props.options.max || 1,
    velocityFactor: this.props.options.velocityFactor || 0.5,
    maxAge: this.props.options.maxAge || 200,
    noParticles: this.props.options.noParticles || 10000,
    fadeOutPercentage: this.props.options.fadeOutPercentage || 0.1,
    stats: false,
  };

  downloadLake = async (url) => {
    var { data } = await axios.get(url, {
      onDownloadProgress: (progressEvent) => {
        const percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        document.getElementById("subtext").innerHTML =
          "Downloading velocity field... " + percentage + "%";
      },
    });
    document.getElementById("subtext").innerHTML =
      "Processing velocity field...";
    return data;
  };

  sceneSetup = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(
      75, // fov = field of view
      width / height, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );
    this.camera.position.z = 55;
    this.camera.position.x = 15;
    this.camera.position.y = 35;
    this.controls = new OrbitControls(this.camera, this.mount);
    this.controls.maxPolarAngle = Math.PI / 2;
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    var light = new THREE.AmbientLight(0x404040);
    this.scene.add(light);

    if (this.state.stats) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.domElement);
    }
  };

  setColors = (colorTitle) => {
    var colors = colorlist.find((c) => c.name === colorTitle).data;
    this.streamlines.setColors(colors);
    this.setState({ colorTitle });
  };

  setMaxAge = (event) => {
    var maxAge = event.target.value;
    this.setState({ maxAge });
    if (maxAge > 0) {
      this.streamlines.setMaxAge(maxAge);
    }
  };

  setVelocityFactor = (event) => {
    var velocityFactor = event.target.value;
    this.setState({ velocityFactor });
    if (velocityFactor > 0) {
      this.streamlines.setVelocityFactor(velocityFactor);
    }
  };

  updateNoParticles = (event) => {
    var noParticles = event.target.value;
    if (noParticles > 10000) {
      alert(
        "Most computers struggle to display more than 10,000 particles. Plotting " +
          noParticles +
          " may crash your browser."
      );
    }
    this.setState({ noParticles });
  };

  setNoParticles = () => {
    var { noParticles } = this.state;
    if (noParticles > 0) {
      this.streamlines.setNoParticles(noParticles);
    }
  };

  async componentDidMount() {
    var { url, process, options } = this.props;
    var { colorTitle } = this.state;
    this.sceneSetup();
    window.addEventListener("resize", this.handleWindowResize);
    var data = await this.downloadLake(url);
    if (process) data = process(data);
    var colors = colorlist.find((c) => c.name === colorTitle).data;
    options["colors"] = colors;
    if ("min" in data) options["min"] = data.min
    if ("max" in data) options["max"] = data.max
    try {
      this.streamlines = new StreamLines(
        data.grid,
        data.bounds,
        this.scene,
        options
      );
      this.startAnimationLoop();
      this.setState({ loaded: true, min: options.min, max: options.max });
    } catch (e) {
      console.error(e);
      document.getElementById("text").innerHTML =
        "Failed to plot 3D streamlines";
      document.getElementById("subtext").innerHTML =
        '<a href="/">Click here to return home.</>';
    }
  }

  startAnimationLoop = () => {
    this.streamlines.animate();
    this.renderer.render(this.scene, this.camera);
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    if (this.state.stats) this.stats.update();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.url !== this.props.url) {
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.scene = null;
    this.projector = null;
    this.camera = null;
    this.controls = null;
  }

  render() {
    var { bottomLeft } = this.props;
    var {
      loaded,
      noParticles,
      velocityFactor,
      maxAge,
      colorTitle,
      min,
      max,
    } = this.state;
    var colors = colorlist.find((c) => c.name === colorTitle).data;
    return (
      <React.Fragment>
        <div className="viewer">
          {loaded && (
            <React.Fragment>
              <Link to="/">
                <div className="home fade-in">
                  <div className="head">3D Streamlines</div>
                  <div className="sub">
                    Visualising 3D velocity fields in the browser
                  </div>
                </div>
              </Link>
              <div className="controls fade-in">
                <div className="plotparameters">
                  <div className="plotrow" style={{ marginBottom: "0" }}>
                    <ColorRamp colors={colors} onChange={this.setColors} />
                    <table className="color-values">
                      <tbody>
                        <tr>
                          <td style={{ textAlign: "left", width: "20%" }}>
                            {Math.floor(min * 100) / 100}
                          </td>
                          <td style={{ textAlign: "center", width: "60%" }}>
                            Velocity (m/s)
                          </td>
                          <td style={{ textAlign: "right", width: "20%" }}>
                            {Math.ceil(max * 100) / 100}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="plotrow">
                    Streams{" "}
                    <input
                      type="number"
                      value={noParticles}
                      onChange={this.updateNoParticles}
                      title="WARNING! Unless your PC is super powerful more than 10000 streams is likely to crash your browser."
                    />
                    <button
                      onClick={this.setNoParticles}
                      title="Update number of streams"
                    >
                      &#8635;
                    </button>
                  </div>
                  <div className="plotrow">
                    Velocity{" "}
                    <input
                      min={1}
                      type="number"
                      value={velocityFactor}
                      onChange={this.setVelocityFactor}
                    />
                  </div>
                  <div className="plotrow">
                    Max Age{" "}
                    <input
                      min={1}
                      type="number"
                      value={maxAge}
                      onChange={this.setMaxAge}
                    />
                  </div>
                </div>
              </div>
              <div className="bottomLeft fade-in">{bottomLeft}</div>
              <div className="git fade-in">
                <a
                  title="Check out the project on GitHub"
                  href="https://github.com/JamesRunnalls/dynamiclakes"
                >
                  <img src={git} alt="git" />
                </a>
              </div>
            </React.Fragment>
          )}

          <div className="threeviewer" ref={(ref) => (this.mount = ref)}>
            {!loaded && (
              <div className="pagecenter">
                <div className="loading-text" id="text">
                  Preparing 3D Streamlines
                </div>
                <div className="loading-subtext" id="subtext">
                  Waiting for response from server...
                </div>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Viewer;
