
import  React, {Component} from 'react';
import { connect } from 'react-redux';
import TextArea from '../../other/text-area';
import { sendInput } from '../../../../functions';

class Caption extends Component {

  constructor(props) {
    super(props);
    this.state = {
      completed: 0,
      text: '',
      memes: [],
      captionedMemes: [null, null]
    }
  }

  componentDidMount() {
    const { playerIndex, gameState } = this.props;
    const playerMemes = gameState.memes.filter(meme => meme.captioner === playerIndex);
    this.setState({memes: playerMemes});
  }

  componentDidUpdate(prevProps) {
    const newMemes = this.props.gameState.memes || [];
    const oldMemes = prevProps.gameState.memes || [];
    const playerMemes = this.state.memes || [];
    const newMemesForPlayer = playerMemes.length ? [] : newMemes.filter(m => m.captioner === this.props.playerIndex);
    const oldMemesForPlayer = playerMemes.length ? [] : oldMemes.filter(m => m.captioner === this.props.playerIndex);
    if (!playerMemes.length && newMemesForPlayer.length && !oldMemesForPlayer.length) {
      this.setState({memes: newMemesForPlayer});
    }
  }

  handleSubmit = () => {
    const {text, captionedMemes, memes} = this.state;
    if (!text) return;
    window.scrollTo(0, 0);
    let {completed} = this.state;
    const index = memes[completed].index;
    const meme = {index, caption: this.state.text};
    captionedMemes[completed] = meme;
    completed++;
    this.setState({completed, text: '', captionedMemes});
    if (completed === 2) {
      const {code, playerIndex} = this.props;
      sendInput(code, playerIndex, captionedMemes);
    }
  }

  updateText = text=> {
    this.setState({text});
  }

  render() {
    const { completed, memes } = this.state;
    if (completed === 2 || !memes.length) {
      const caption = completed === 2 ? 'Done. Still waiting for:' : 'Waiting for players to caption memes:';
      return <div className="center-screen">
        <div className="column">
          <h2>{caption}</h2>
          <div className="waiting-for-list">
            {(this.props.gameState.waitingFor || [])
              .filter(p => p.index !== this.props.playerIndex)
              .map((p, i) => <div key={i}>{p.name}</div>)}
          </div>
        </div>
      </div>
    }
    const image = memes[completed ? 1 : 0].image;
    return <div className="caption-screen column">
      <div className="step">
        <div className="impact">Step 2:</div>
        <div className="impact large-font">Caption Memes</div>
      </div>
      <h2 style={{marginBottom: 0}}>{`Caption ${completed + 1} / 2`}</h2>

      <TextArea key={completed} maxLength={120} onChange={this.updateText} />

      <div>
        <img alt="meme" src={Number.isInteger(image) ? `/assets/img/meme/templates/${image}.jpg` : image} />
      </div>

      <div className="row">
        <button type="submit" disabled={!this.state.text} onClick={this.handleSubmit}>Submit</button>
      </div>
    </div>
  }
}

function mapStateToProps({ gameState, playerIndex, code }) {
  return { gameState, playerIndex, code };
}

export default connect(mapStateToProps, null)(Caption);


