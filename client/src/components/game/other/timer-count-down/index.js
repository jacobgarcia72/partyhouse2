import React, {Component} from 'react';
import {connect} from 'react-redux';
import './style.sass';

class TimerCountDown extends Component {

  render() {
    const { timer } = this.props.gameState;
    if (!timer) {
      return null;
    }
    let backgroundColor = '#13b013';
    if (timer <= 1) {
      backgroundColor = '#000000';
    } else if (timer <= 7) {
      backgroundColor = '#aa0000';
    } else if (timer <= 12) {
      backgroundColor = '#ff1010';
    } else if (timer <= 17) {
      backgroundColor = '#f08000';
    } else if (timer <= 22) {
      backgroundColor = '#f0e000';
    }
    return (
      <div className="timer-count-down" style={{backgroundColor}}>
        {timer - 1}
      </div>
    )
  }
}

function mapStateToProps({ gameState }) {
  return { gameState };
}

export default connect(mapStateToProps, null)(TimerCountDown);
