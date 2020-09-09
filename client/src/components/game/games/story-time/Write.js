import React, {Component} from 'react';
import { connect } from 'react-redux';
import { sendInput } from '../../../../functions';
import TextArea from '../../other/text-area';

class Write extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isWriter: null,
      submitted: false,
      text: ''
    }
  }

  componentDidMount() {
    const { playerIndex, gameState } = this.props;
    const isWriter = Boolean(gameState.writers.find(w => w.index === playerIndex));
    this.setState({isWriter});
  }

  updateText = text=> {
    this.setState({text});
    const { code, playerIndex } = this.props;
    sendInput(code, playerIndex, {text});
  }

  handleSubmit = () => {
    const { code, playerIndex } = this.props;
    const { text } = this.state;
    sendInput(code, playerIndex, {text, submitted: true});
    this.setState({text, submitted: true});
  }

  render() {
    if (this.state.isWriter && !this.state.submitted) {
      return <form className="column">
        <TextArea maxLength={120} onChange={this.updateText} startingText={`${this.props.gameState.prompt},`} />
        <button type="submit" disabled={!this.state.text} onClick={this.handleSubmit}>Submit</button>
      </form>
    } else {
      const { gameState, input } = this.props;
      return gameState.writers.map(w => {
        const text = input && input[w.index] ? input[w.index].text : ' ';
        return <div className="row writer-input" key={w.index}>
          <div className="row writer-name">{w.name}</div>
          <div className="row speech-bubble-container">
            <div className="speech-bubble">{gameState.prompt},&nbsp;{text}</div>
          </div>
        </div>
      });
    }
  }
}

function mapStateToProps({ gameState, playerIndex, code, input }) {
  return { gameState, playerIndex, code, input };
}

export default connect(mapStateToProps, null)(Write);