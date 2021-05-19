import React, { Component } from "react";
import Viewer from "../../components/viewer/viewer";

class DensityCurrents extends Component {
  state = {
    options: {
      velocityFactor: 5,
      noParticles: 10000,
      min: 0,
      max: 0.05,
    },
  };
  process = (data) => {
    data.bounds.xMin =
      -(parseFloat(data.bounds.xMax) - parseFloat(data.bounds.xMin)) / 8;
    data.bounds.xMax =
      (parseFloat(data.bounds.xMax) - parseFloat(data.bounds.xMin)) / 8;
    data.bounds.yMin =
      -(parseFloat(data.bounds.yMax) - parseFloat(data.bounds.yMin)) / 8;
    data.bounds.yMax =
      (parseFloat(data.bounds.yMax) - parseFloat(data.bounds.yMin)) / 8;
    data.bounds.zMin =
      -(parseFloat(data.bounds.zMax) - parseFloat(data.bounds.zMin)) / 3;
    data.bounds.zMax =
      (parseFloat(data.bounds.zMax) - parseFloat(data.bounds.zMin)) / 3;
    delete data.grid.m;
    return data;
  };
  render() {
    document.title = "Density Currents | 3D Streamlines";
    var reference = (
      <div>
        <div>Hydrodynamic simulation of density currents.</div>
        <div>
          <b>Data:</b> Cintia Ramón Casañas. Eawag. 2021.{" "}
        </div>
      </div>
    );
    var url =
      "https://3dstreamlines.s3.eu-central-1.amazonaws.com/densitycurrent.json";
    return (
      <Viewer
        url={url}
        bottomLeft={reference}
        process={this.process}
        options={this.state.options}
      />
    );
  }
}

export default DensityCurrents;
