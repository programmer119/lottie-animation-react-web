import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Lottie, { LottieAnimationItem } from "lottie-web";

const propTypes = {
  wrapClassName: PropTypes.string,
  className: PropTypes.string,
  animationData: PropTypes.object,
  path: PropTypes.string,
  loop: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  autoplay: PropTypes.bool,
  name: PropTypes.string,
  renderer: PropTypes.oneOf(["svg", "canvas", "html"]),
  // soustomer
  speed: PropTypes.number,
  direction: PropTypes.number,
  //
  loopStartFrame: PropTypes.number,
  startFromLastFrame: PropTypes.bool,
  // events
  onComplete: PropTypes.func,
  onLoopComplete: PropTypes.func,
  // click
  onClick: PropTypes.func
};

const defaultProps = {
  wrapClassName: "lottie-container",
  className: "svg-heart",
  animationData: {},
  path: "",
  loop: true,
  autoplay: true,
  name: "",
  renderer: "svg",
  // coustomer
  speed: 1, // 1+ more fast / 0:normal[base:1] / -1 more fast with -direction
  direction: 1, // -1, 1
  //
  defaultStartFrame: 0, // default start frame
  startFromLastFrame: false, // [true]: start from last frame [false]: start from 0 frame
  // events
  onComplete: () => console.log("onComplete"),
  onLoopComplete: () => console.log("onLoopComplete"),
  // onClick
  onClick: () => console.log("onClick")
};

class LottieSVG extends PureComponent {
  static propTypes = propTypes;

  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.animation = LottieAnimationItem || null;
    this.state = {
      isProgress: false
    };
  }

  refContainer = (container) => {
    if (!container) return;
    this.container = container;
  };

  componentDidMount() {
    this.initialLottie();
  }

  componentWillUnmount() {
    if (!this.animation || this.state.isProgress) return;
    this.destroy(); // make sure unmount will destroy self and release memory.
  }

  initialLottie = async () => {
    const {
      className,
      animationData,
      renderer,
      path,
      loop,
      autoplay,
      // coustomer
      speed,
      direction,
      //
      defaultStartFrame,
      startFromLastFrame,
      // events
      onComplete,
      onLoopComplete
    } = this.props;

    this.animation = Lottie.loadAnimation({
      animationData,
      loop,
      autoplay,
      name: "",
      container: this.container,
      renderer,
      rendererSettings: {
        className: `svg-${className}`,
        preserveAspectRatio: "xMinYMin slice" // Supports the same options as the svg element's preserveAspectRatio property
      }
    });
    // console.log("componentDidMount", this.animation);

    // setSpeed
    this.animation.setSpeed(speed);

    // setDirection
    this.animation.setDirection(direction);

    // startFromLastFrame
    if (startFromLastFrame) {
      this.goToAndStop(this.animation.getDuration(true), true);
    } else {
      this.goToAndStop(defaultStartFrame, true);
    }

    // reset autoplay
    if (autoplay) {
      this.goToAndPlay(defaultStartFrame, true);
    }

    if (onComplete) {
      this.animation.addEventListener("complete", () => {
        // console.log("animation load complete.");
        onComplete(this);
      });
    }

    if (onLoopComplete) {
      this.animation.addEventListener("loopComplete", () => {
        // console.log("animation loop complete.");
        onLoopComplete(this);
      });
    }
  };

  play() {
    if (!this.animation || this.state.isProgress) return;
    this.setState((state) => ({ ...state, isProgress: true }));
    this.animation.play();
  }

  stop() {
    this.setState((state) => ({ ...state, isProgress: false }));
    if (!this.animation) return;
    this.animation.stop();
  }

  pause() {
    this.setState((state) => ({ ...state, isProgress: false }));
    if (!this.animation) return;
    this.animation.pause();
  }

  destroy() {
    if (!this.animation) return;
    this.animation.destroy();
    this.animation = null;
  }

  goToAndPlay(startFrame = 0, isFrame = true) {
    if (!this.animation || this.state.isProgress) return;
    this.setState((state) => ({ ...state, isProgress: true }));
    const { defaultStartFrame } = this.props;
    this.animation.goToAndPlay(startFrame || defaultStartFrame, isFrame);
  }

  goToAndStop(stopFrame = 0, isFrame = true) {
    this.setState((state) => ({ ...state, isProgress: false }));
    if (!this.animation) return;
    const { startFromLastFrame, defaultStartFrame } = this.props;
    this.animation.goToAndStop(
      stopFrame || startFromLastFrame
        ? this.animation.getDuration(true)
        : defaultStartFrame,
      true
    );
  }

  render() {
    const { onClick } = this.props;
    return (
      <div
        ref={this.refContainer}
        className={this.props.wrapClassName}
        onClick={() => onClick(this)}
      />
    );
  }
}

LottieSVG.propTypes = propTypes;

LottieSVG.defaultProps = defaultProps;

export default LottieSVG;
