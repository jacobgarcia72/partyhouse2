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
    if (timer <= 6) {
      backgroundColor = '#ff2020'
    } else if (timer <= 11) {
      backgroundColor = '#f09000'
    } else if (timer <= 16) {
      backgroundColor = '#f0e000'
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
