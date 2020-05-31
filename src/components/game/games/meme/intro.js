import React, {Component} from 'react';
import { connect } from 'react-redux';

class Intro extends Component {

  state = {animate: 0}

  componentDidMount() {
    setTimeout(() => {
      this.setState({animate: 1});
    }, 500);
    setTimeout(() => {
      this.setState({animate: 2});
    }, 2500);
    if (this.props.isHost) {
      setTimeout(() => {
        this.props.nextScreen();
      }, 3000);
    }
  }

  render() {
    const { animate } = this.state;
    let className1 = 'cross-zoom-in';
    let className2;
    if (animate === 1) {
      className2 = 'cross-zoom-in';
    } else if (animate === 2) {
      className2 = className1 = 'cross-zoom-out';
    }
    const style = {display: animate === 0 ? 'none' : 'block'};
    return <div className="impact no-scroll center-screen">
      <h1>
        <div className={className1}>Welcome to</div>
        <div style={style} className={className2}>Dank U</div>
      </h1>
    </div>
  }
}

function mapStateToProps({ isHost }) {
  return { isHost };
}

export default connect(mapStateToProps, null)(Intro);
