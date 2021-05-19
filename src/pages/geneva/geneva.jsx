import React, { Component } from "react";
import * as d3 from "d3";
import Viewer from "../../components/viewer/viewer";

class Geneva extends Component {
  state = {
    zScale: 40,
    yScale: 1,
    xScale: 1,
    bounds: 45,
    options: {
      velocityFactor: 2,
      min: 0,
      max: 0.1,
    },
  };
  dataToGrid = (arr, radius, depths) => {
    function createAndFillTwoDArray({ rows, columns, defaultValue }) {
      return Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => defaultValue)
      );
    }

    var data = JSON.parse(JSON.stringify(arr));

    var nCols = 200;
    var nRows = 200;

    let x_array = data.map((df) => df[0]);
    let y_array = data.map((df) => df[1]);

    let xMin = Math.min(...x_array);
    let yMin = Math.min(...y_array);
    let xMax = Math.max(...x_array);
    let yMax = Math.max(...y_array);

    let xSize = (xMax - xMin) / nCols;
    let ySize = (yMax - yMin) / nRows;

    let quadtree = d3
      .quadtree()
      .extent([
        [xMin, yMin],
        [xMax, yMax],
      ])
      .addAll(data);

    var u = createAndFillTwoDArray({
      rows: nRows + 1,
      columns: nCols + 1,
      defaultValue: null,
    });
    var v = createAndFillTwoDArray({
      rows: nRows + 1,
      columns: nCols + 1,
      defaultValue: null,
    });
    var w = createAndFillTwoDArray({
      rows: nRows + 1,
      columns: nCols + 1,
      defaultValue: new Array(depths.length).fill(0),
    });
    var x, y;
    for (var i = 0; i < nRows + 1; i++) {
      y = yMax - i * ySize;
      for (var j = 0; j < nCols + 1; j++) {
        x = xMin + j * xSize;
        let quad = quadtree.find(x, y, radius);
        if (quad !== undefined) {
          u[i][j] = JSON.parse(JSON.stringify(quad[2])).map(function (item) {
            return item === -999 ? null : item;
          });
          v[i][j] = JSON.parse(JSON.stringify(quad[3])).map(function (item) {
            return item === -999 ? null : -item;
          });
        }
      }
    }
    return {
      u,
      v,
      w,
      xMin,
      xMax,
      yMin,
      yMax,
    };
  };
  globalToLocalCoordinate = (depths, arr) => {
    var { bounds, zScale, xScale, yScale } = this.state;
    let x_array = arr.map((q) => q[0]);
    let y_array = arr.map((q) => q[1]);

    let xMin = Math.min(...x_array);
    let yMin = Math.min(...y_array);
    let min_z = Math.min(...depths);
    let xMax = Math.max(...x_array);
    let yMax = Math.max(...y_array);
    let max_z = Math.max(...depths);
    let dif_x = xMax - xMin;
    let dif_y = yMax - yMin;

    var ybound, xbound, zbound;
    if (dif_x > dif_y) {
      xbound = bounds * xScale;
      ybound = bounds * ((yMax - yMin) / (xMax - xMin)) * yScale;
      zbound = bounds * ((max_z - min_z) / (xMax - xMin)) * zScale;
    } else {
      ybound = bounds * yScale;
      xbound = bounds * ((xMax - xMin) / (yMax - yMin)) * xScale;
      zbound = bounds * ((max_z - min_z) / (yMax - yMin)) * zScale;
    }

    var min = {
      x: -xbound,
      y: -ybound,
      z: -zbound,
    };
    var max = { x: xbound, y: ybound, z: 0 };

    depths = depths.map(
      (d) => min.z + ((d - min_z) / (max_z - min_z)) * (max.z - min.z)
    );

    arr = arr.map((a) => {
      a[0] = min.x + ((a[0] - xMin) / (xMax - xMin)) * (max.x - min.x);
      a[1] = min.y + ((a[1] - yMin) / (yMax - yMin)) * (max.y - min.y);
      return a;
    });
    return { depths, arr };
  };
  process = (data) => {
    data = this.globalToLocalCoordinate(data.depths, data.arr);
    var { u, v, w, xMin, xMax, yMin, yMax } = this.dataToGrid(
      data.arr,
      0.5,
      data.depths
    );
    data = {
      grid: { u, v, w, z: data.depths },
      bounds: { xMin, xMax, yMin, yMax, zLen: data.depths.length },
    };
    return data;
  };
  render() {
    document.title = "Lake Geneva | 3D Streamlines";
    var reference =
      "Dynamic lakes displays simulated mixing in Lake Geneva from Jan 4th. Data comes from the Meteolakes project.";
    var url =
      "https://3dstreamlines.s3.eu-central-1.amazonaws.com/lakegeneva.json";
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

export default Geneva;
