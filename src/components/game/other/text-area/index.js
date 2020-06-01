import React, {Component} from 'react';

export default class TextArea extends Component {

  constructor(props) {
    super(props);
    this.state={
      text: ''
    }
  }

  onChange = text=> {
    this.setState({text});
    this.props.onChange(text);
  }

  render() {  
    const maxLength = this.props.maxLength || 120;
    const {text} = this.state;
    const remainingChars = maxLength-text.length;
    return (
      <div className="TextArea">
        <div id='characters-remaining' style={{color: remainingChars ? remainingChars < 10 ? '#ba0000' : '#111111' : '#ff0000', height: '1.1rem', textAlign: 'right'}}>
          <span style={{ backgroundColor: 'white', padding: '0 0.25em', borderRadius: '0.5em', display: remainingChars <= 20 ? 'inline' : 'none'}}>
            {remainingChars}
          </span>
        </div>
        <textarea 
          className="textbox" 
          value={text}
          maxLength={maxLength} 
          rows={Math.max(2, Math.round(maxLength / 30))} 
          onChange={e=>this.onChange(e.target.value)}
        ></textarea>
      </div>
    )
  }
}
