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
      screen: screens.chooseQuestions,
      category
    });
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
          <form  onSubmit={e => e.preventDefault()}>
            {categories.map((cat, i) => <button type="submit" key={i} onClick={() => this.submitCategoryChoice(cat)}>{formatText(cat, rounds[round], players)}</button>)}
          </form>
        </div>
    } else {
      return <div>{players.find(player => player.index === rounds[round].answeringIndex).name} is choosing a category...</div>
    }
  }
}

function mapStateToProps({ gameState, playerIndex, players, code }) {
  return { gameState, playerIndex, players, code };
}

export default connect(mapStateToProps, null)(ChooseCategory);
