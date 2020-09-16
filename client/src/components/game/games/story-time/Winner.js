import React, {Component} from 'react';
import { connect } from 'react-redux';

class Winner extends Component {

  render() {
    const { story, turn, winner } = this.props.gameState;
    return (
      <div className="center-screen">
        <div className="column winner">
          <div className="winning fade-in">Winning Caption:</div>
          <div className="speech-bubble speech-bubble-down slide-in-from-bottom">
            {story[turn + 1]}
          </div>
          <div className="winner-name slide-in-from-top">
            {winner}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ gameState }) {
  return { gameState };
}

export default connect(mapStateToProps, null)(Winner);