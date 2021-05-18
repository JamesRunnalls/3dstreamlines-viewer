import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./notfound.css";

class NotFound extends Component {
  render() {
    var url = window.location.href;
    document.title = "Not Found | 3D Streamlines";
    return (
      <div className="notfound">
        <h1>404 Page Not Found</h1>
        <h3>
          The requested URL <div className="url">{url}</div> does not exist.
        </h3>
        <h3>
          <Link to="/">Return Home</Link>
        </h3>
      </div>
    );
  }
}

export default NotFound;
