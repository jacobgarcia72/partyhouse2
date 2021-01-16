import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getQuestions, formatText, screens } from './helpers';
import { setGameState } from '../../../../functions/index';

class ChooseQuestion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      questions: []
    }
  }

  componentDidMount() {
    const { playerIndex, gameState, players } = this.props;
    const { round, rounds, category } = gameState;
    if (rounds[round].askingIndex === playerIndex) {
      const questions = getQuestions(category).map(question => formatText(question, rounds[round], players));
      this.setState({questions});
    }
  }

  submitQuestionChoice = (question) => {
    setGameState(this.props.code, {
      screen: screens.readQuestion,
      question
    });
  }

  render() {
    const { playerIndex, gameState, players } = this.props;
    const { round, rounds } = gameState;
    const { questions } = this.state;
    const { answeringIndex, askingIndex } = rounds[round];
    const answeringPlayer = answeringIndex === playerIndex ? 'you' : players.find(player => player.index === answeringIndex).name;
    const askingPlayer =  players.find(player => player.index === askingIndex).name;
    if (!rounds || !rounds[round]) {
      return <div>Loading...</div>;
    } else if (askingIndex === playerIndex) {
      return <div className="column">
          <h2>Choose a question for {answeringPlayer}:</h2>
          <form onSubmit={e => e.preventDefault()} className="column options">
            {questions.map((question, i) => <button type="submit" key={i} onClick={() => this.submitQuestionChoice(question)}>{question}</button>)}
          </form>
        </div>
    } else {
      return <h2>{askingPlayer} is choosing a question for {answeringPlayer}...</h2>
    }
  }
}

function mapStateToProps({ gameState, playerIndex, players, code }) {
  return { gameState, playerIndex, players, code };
}

export default connect(mapStateToProps, null)(ChooseQuestion);
