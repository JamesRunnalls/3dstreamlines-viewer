import React, { Component } from "react";
import Viewer from "../../components/viewer/viewer";

class Tornado extends Component {
  process = (data) => {
    data.bounds.zMin = -20.0;
    data.bounds.zMax = 20.0;
    return data;
  };
  render() {
    document.title = "Tornado | 3D Streamlines";
    var reference = (
      <div>
        <div>Synthetic model of a tornado.</div>
        <div>
          <b>Data:</b> Roger Crawfis. Tornado Data set generator. 2003.{" "}
          <a href="http://web.cse.ohio-state.edu/~crawfis.3/Data/Tornado/">
            http://web.cse.ohio-state.edu/~crawfis.3/Data/Tornado/
          </a>{" "}
        </div>
      </div>
    );
    var url =
      "https://3dstreamlines.s3.eu-central-1.amazonaws.com/tornado.json";
    return <Viewer url={url} bottomLeft={reference} process={this.process} />;
  }
}

export default Tornado;
