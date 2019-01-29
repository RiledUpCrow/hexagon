import React, { Component } from "react";
import "./App.css";
import Game from "./Game";
import UI from "./UI";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Game />
        <UI />
      </div>
    );
  }
}

export default App;
