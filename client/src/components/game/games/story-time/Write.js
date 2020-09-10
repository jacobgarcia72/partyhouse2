import React, {Component} from 'react';
import { connect } from 'react-redux';
import { sendInput } from '../../../../functions';
import TextArea from '../../other/text-area';
import { screens } from '../meme/helpers';

class Write extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submittedText: false,
      submittedVote: false,
      text: ''
    }
  }

  updateText = text=> {
    this.setState({text});
    const { code, playerIndex } = this.props;
    sendInput(code, playerIndex, {text});
  }

  handleSubmit = e => {
    e.preventDefault();
    const { code, playerIndex } = this.props;
    let { text } = this.state;
    const punctuation = ['.','!','?',';','"',')','(','-'];
    if (!punctuation.includes(text.charAt(text.length - 1))) {
      text += '.';
    }
    sendInput(code, playerIndex, {text, submitted: true});
    this.setState({text, submittedText: true});
  }

  submitVote = (e, indexOfPlayerVotedFor) => {
    e.preventDefault();
    const { code, playerIndex } = this.props;
    this.setState({submittedVote: true});
    sendInput(code, playerIndex, indexOfPlayerVotedFor);
  }

  renderPlayerResponses = () => {
    const { writers, submittedCaptions, prompt } = this.props.gameState;
    return writers.map(w => {
      const text = submittedCaptions && submittedCaptions[w.index] ? submittedCaptions[w.index] : ' ';
      return (
        <div className="row writer-input" key={w.index}>
          <div className="row writer-name">{w.name}</div>
          <div className="row speech-bubble-container">
            <div className="speech-bubble">{prompt},&nbsp;{text}</div>
          </div>
        </div>
      )
    });
  }

  renderVotingOptions = () => {
    const { gameState } = this.props;
    if (gameState.screen !== screens.vote) {
      return null;
    } else if (this.state.submittedVote) {
      return <div>Vote submitted. Waiting for other players.</div>;
    } else {
      const renderVoteButton = player => (
        <button type="submit" onClick={e => this.submitVote(e, player.index)}
          className="vote-btn" key={player.index}>{player.name}
        </button>
      );
      return (
        <div className="column">
          <div>Vote:</div>
          <form className="row" onSubmit={e => e.preventDefault()}>
            {gameState.writers.map(renderVoteButton)}
          </form>
        </div>
      )
    }
  }

  render() {
    const { gameState, playerIndex } = this.props;
    const isWriter = Boolean(gameState.writers.find(w => w.index === playerIndex));
    if (isWriter && !this.state.submittedText) {
      const { prompt } = this.props.gameState;
      return <form className="column" onSubmit={e => e.preventDefault()}>
        <TextArea maxLength={120 + prompt.length} onChange={this.updateText} startingText={`${prompt},`} />
        <button type="submit" disabled={!this.state.text} onClick={this.handleSubmit}>Submit</button>
      </form>
    } else {
      return (
        <div className="column">
          {this.renderVotingOptions()}
          {this.renderPlayerResponses()}
        </div>
      )
    }
  }
}

function mapStateToProps({ gameState, playerIndex, code, input }) {
  return { gameState, playerIndex, code, input };
}

export default connect(mapStateToProps, null)(Write);