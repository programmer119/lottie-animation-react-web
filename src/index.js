import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import LottieSVG from "./LottieSVG.js";
import cx from "classnames";
import dataJSON from "./heart.json";

// import axios from "axios";
// import fetch from "isomorphic-fetch";

import "./styles.css";

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLike: false
    };
  }

  handleClick(lottie) {
    // console.log("onClick", lottie.animation);
    if (lottie.animation) {
      this.setState((state) => ({ ...state, isLike: true }));
      lottie.goToAndPlay();
    } else {
      this.setState((state) => ({ ...state, isLike: false }));
      lottie.initialLottie();
    }
  }

  handleComplete(lottie) {
    // console.log("onComplete", lottie);
    lottie.destroy();
  }

  render() {
    const animationData = dataJSON || null; // || axios || fetch from url.
    return (
      <div className="App">
        <h1>PopDaily React Lottie Example</h1>
        <LottieSVG
          wrapClassName={cx("lottie-container", { like: this.state.isLike })}
          className="heart"
          animationData={animationData}
          loop={false}
          autoPlay={false}
          defaultStartFrame={33}
          startFromLastFrame={false}
          onClick={(lottie) => this.handleClick(lottie)}
          onComplete={(lottie) => this.handleComplete(lottie)}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
