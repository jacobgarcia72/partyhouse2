import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getCategories, formatText, screens } from './helpers';
import { setGameState } from '../../../../functions/index';

class ChooseCategory extends Component {

  state = {
    categories: []
  }

  componentDidMount() {
    this.setState({categories: getCategories()});
  }

  submitCategoryChoice = (category) => {
    setGameState(this.props.code, {
      screen: screens.chooseQuestion,
      category
    });
  }

  render() {
    const { playerIndex, gameState, players } = this.props;
    const { round, rounds } = gameState;
    const { categories } = this.state;
    const loading = <div>Loading...</div>;
    if (!rounds || !rounds[round]) {
      return loading;
    } else if (rounds[round].answeringIndex === playerIndex) {
      return <div className="column">
          <h2>Choose a category:</h2>
          <form  onSubmit={e => e.preventDefault()} className="column options">
            {categories.map((cat, i) => <button type="submit" key={i} onClick={() => this.submitCategoryChoice(cat)}>{formatText(cat, rounds[round], players)}</button>)}
          </form>
        </div>
    } else {
      const player = players.find(player => player.index === rounds[round].answeringIndex);
      return player ? <h2>{player.name} is choosing a category...</h2> : loading;
    }
  }
}

function mapStateToProps({ gameState, playerIndex, players, code }) {
  return { gameState, playerIndex, players, code };
}

export default connect(mapStateToProps, null)(ChooseCategory);
