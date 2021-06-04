import React, { Component } from "react";
import git from "./img/git.png";
import geneva from "./img/geneva.gif";
import tornado from "./img/tornado.gif";
import "./css/home.css";

class Page extends Component {
  state = {};
  render() {
    var { name, link, description, img } = this.props.details;
    return (
      <a href={link}>
        <div className="page">
          <img src={img} alt={name} />
          <div className="name">{name}</div>
          <div>{description}</div>
        </div>
      </a>
    );
  }
}

class Home extends Component {
  state = {
    pages: [
      {
        name: "Lake Geneva",
        link: "lakegeneva",
        description: "Simulated mixing in Lake Geneva from Jan 4th",
        img: geneva,
      },
      {
        name: "Tornado",
        link: "tornado",
        description: "Synthetic model of a tornado created by Roger Crawfis",
        img: tornado,
      },
    ],
  };
  render() {
    document.title = "Home | 3D Streamlines";
    return (
      <div className="main">
        <div className="title">
          <div className="head">3D Streamlines</div>
          <div className="sub">
            Visualising 3D velocity fields in the browser
          </div>
        </div>

        <div className="gallery fade-in">
          {this.state.pages.map((p) => (
            <Page details={p} key={p.name} />
          ))}
        </div>
        <div className="git fade-in">
          <a
            title="Check out the project on GitHub"
            href="https://github.com/JamesRunnalls/3dstreamlines"
          >
            <img src={git} alt="git" />
          </a>
        </div>
      </div>
    );
  }
}

export default Home;
