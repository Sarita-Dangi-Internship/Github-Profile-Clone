import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import "./styles/main.scss";
import Home from "./pages/home";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </div>
    );
  }
}
