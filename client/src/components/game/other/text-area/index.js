import React, {Component} from 'react';

export default class TextArea extends Component {

  constructor(props) {
    super(props);
    this.state={
      text: ''
    }
  }

  onChange = text => {
    if (this.props.startingText) {
      text = text.slice(this.props.startingText.length + 1);
    }
    this.setState({text});
    this.props.onChange(text);
  }
  
  setFocusOutsideStartingText = e => {
    const { startingText } = this.props;
    if (startingText && e.target.selectionStart < startingText.length + 1) {
      e.target.setSelectionRange(startingText.length + 1, startingText.length + 1);
    }
  }

  render() {
    const maxLength = this.props.maxLength || 120;
    const { text } = this.state;
    const { startingText } = this.props;
    const displayText = startingText ? `${startingText} ${text}` : text;
    const remainingChars = maxLength - displayText.length;
    return (
      <div className="TextArea">
        <div id='characters-remaining' style={{
          color: remainingChars ? remainingChars < 10 ? '#ba0000' : '#111111' : '#ff0000',
          height: '1rem',
          textAlign: 'right',
          fontFamily: 'sans-serif',
          fontSize: '12pt'
        }}>
          <span style={{
            backgroundColor: 'white',
            padding: '0 0.25em',
            borderRadius: '0.5em',
            display: remainingChars <= 20 ? 'inline' : 'none'
          }}>
            {remainingChars}
          </span>
        </div>
        <textarea 
          className="textbox" 
          value={displayText}
          maxLength={maxLength} 
          rows={Math.max(2, Math.round(maxLength / 30))} 
          onChange={e=>this.onChange(e.target.value)}
          onClick={this.setFocusOutsideStartingText}
        ></textarea>
      </div>
    )
  }
}
