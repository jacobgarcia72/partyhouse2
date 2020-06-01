
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
    const { gameState, playerIndex } = this.props;
    const memes = gameState.memes.filter(meme => meme.captioner === playerIndex);
    this.setState({memes});
  }

  handleSubmit = () => {
    const {text, captionedMemes, memes} = this.state;
    if (!text) return;
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
    if (completed === 2) {
      return <div className="center-screen">
        <h2>Done. Waiting for other players.</h2>
      </div>
    } else if (!memes.length) {
      return null;
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


