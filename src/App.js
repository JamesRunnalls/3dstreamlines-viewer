import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/home/home";
import NotFound from "./pages/notfound/notfound";
import Tornado from './pages/tornado/tornado';
import Geneva from './pages/geneva/geneva';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/tornado" exact component={Tornado} />
          <Route path="/lakegeneva" exact component={Geneva} />
          <Route path="/" exact component={Home} />
          <Route path="/" component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
