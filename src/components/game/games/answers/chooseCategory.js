import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getCategories, formatText } from './helpers';

class ChooseCategory extends Component {

  state = {
    categories: []
  }

  componentDidMount() {
    this.setState({categories: getCategories()});
  }

  render() {
    const { playerIndex, gameState, players } = this.props;
    const { round, rounds } = gameState;
    const { categories } = this.state;
    if (!rounds || !rounds[round]) {
      return <div>Loading...</div>;
    } else if (rounds[round].answeringIndex === playerIndex) {
      return <div className="column">
          <div>Choose a category:</div>
          {categories.map((cat, i) => <button key={i}>{formatText(cat, rounds[round], players)}</button>)}
        </div>
    } else {
      return <div>{players.find(player => player.index === rounds[round].answeringIndex).name} is choosing a category...</div>
    }
  }
}

function mapStateToProps({ gameState, playerIndex, players }) {
  return { gameState, playerIndex, players };
}

export default connect(mapStateToProps, null)(ChooseCategory);
