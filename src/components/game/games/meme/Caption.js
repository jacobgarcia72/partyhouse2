
import  React, {Component} from 'react';

import Timer from '../../other/Timer';

import {sendInput} from '../../../../actions';
import TextArea from '../../other/TextArea';

export default class Caption extends Component {

  constructor(props) {
    super(props);
    this.state = {
      completed: 0,
      text: '',
      captionedMemes: [null, null]
    }
  }

  handleSubmit = timeout => {
    if (!this.state.text) return;
    const memes = this.props.request.message;
    let {completed, captionedMemes} = this.state;

    const index = memes[completed].index;
    const meme = {index, caption: this.state.text};
    captionedMemes[completed] = meme;
    const {code, playerIndex, request} = this.props;
    completed++;
    this.setState({completed, text: '', captionedMemes});
    const done = completed === 2;
    sendInput(code, playerIndex, request.type, captionedMemes, done);
    if (done || timeout) {
      this.props.handleSubmit();
    }
  }

  updateText = text=> {
    this.setState({text});
  }
  
  render() {
    const memes = this.props.request.message;
    const {completed} = this.state;
    const image = memes[completed ? 1 : 0].image

    return <div className="Meme Caption column">
      <Timer code={this.props.code} onFinish={()=>this.handleSubmit(true)} />
      <div className="row">
        <div className="font-large">{`Caption ${completed+1} / 2`}</div>
      </div>

      <TextArea key={completed} maxLength={120} onChange={this.updateText} />

      <div>
        <img alt="meme" src={Number.isInteger(image) ? `/assets/img/meme/${image}.jpg` : image} />
      </div>

      <div className="row">
        <div className={`btn${this.state.text ? '' : ' btn-disabled'}`} onClick={()=>this.handleSubmit(false)}>Submit</div>
      </div>
    </div>
  }
}


