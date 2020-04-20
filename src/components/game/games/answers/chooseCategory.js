import React, {Component} from 'react';
import { connect } from 'react-redux';

class ChooseCategory extends Component {

  render() {
    const { playerIndex, gameState, players } = this.props;
    const { round, rounds } = gameState;
    if (!rounds || !rounds[round]) {
      return <div>Loading...</div>;
    } else if (rounds[round].answeringIndex === playerIndex) {
      return <div>Choose a category:</div>
    } else {
      return <div>{players.find(player => player.index === rounds[round].answeringIndex).name} is choosing a category...</div>
    }
  }
}

function mapStateToProps({ gameState, playerIndex, players }) {
  return { gameState, playerIndex, players };
}

export default connect(mapStateToProps, null)(ChooseCategory);
