import React, { Component } from "react";
import Viewer from "../../components/viewer/viewer";

class Geneva extends Component {
  process = (data) => {
    console.log(data)

    return data;
  };
  render() {
    document.title = "Lake Geneva | 3D Streamlines";
    var reference = "Dynamic lakes displays simulated mixing in Lake Geneva from Jan 4th. Data comes from the Meteolakes project.";
    var url =
      "https://dynamiclakes.s3.eu-central-1.amazonaws.com/geneva_20210104_0000.json";
    return <Viewer url={url} bottomLeft={reference} process={this.process} />;
  }
}

export default Geneva;
