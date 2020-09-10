import React, {Component} from 'react';
import { connect } from 'react-redux';

class Winner extends Component {

  componentDidMount() {
    const { story, turn, winner } = this.props.gameState;
    console.log(story)
    console.log(turn)
    console.log(story[turn + 1])
  }

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