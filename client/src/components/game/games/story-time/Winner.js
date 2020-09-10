import React, {Component} from 'react';
import { connect } from 'react-redux';

class Winner extends Component {

  render() {
    const { story, turn, winner } = this.props.gameState;
    return (
      <div className="column">
        <div>Winning Caption:</div>
        <div className="speech-bubble">
          {story[turn + 1]}
        </div>
        <div className="winner-name">{winner}</div>
      </div>
    )
  }
}

function mapStateToProps({ gameState }) {
  return { gameState };
}

export default connect(mapStateToProps, null)(Winner);