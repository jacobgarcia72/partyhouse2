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
    const { playerIndex, gameState } = this.props;
    const { round, rounds, category } = gameState;
    if (rounds[round].askingIndex === playerIndex) {
      this.setState({questions: getQuestions(category)});
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
          <div>Choose a question for {answeringPlayer}:</div>
          <form  onSubmit={e => e.preventDefault()}>
            {questions.map((question, i) => <button type="submit" key={i} onClick={() => this.submitQuestionChoice(question)}>{formatText(question, rounds[round], players)}</button>)}
          </form>
        </div>
    } else {
      return <div>{askingPlayer} is choosing a question for {answeringPlayer}...</div>
    }
  }
}

function mapStateToProps({ gameState, playerIndex, players, code }) {
  return { gameState, playerIndex, players, code };
}

export default connect(mapStateToProps, null)(ChooseQuestion);
