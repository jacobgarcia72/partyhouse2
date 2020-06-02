/*

props.lines = Arr[String]

Takes lines of text and animates them into splash screen 
one word at a time

*/

import React, {Component} from 'react';

export default class Title extends Component {

  constructor(props) {
    super(props);
    const words = props.lines.map(line=>line.split(' '));
    this.state = {
      words,
      i: 0, j: 0
    }
  }

  componentDidMount() {
    this.animateWords();
  }

  animateWords = ()=> {
    let i = 0;
    let j = 0;
    const animate = setInterval(()=>{
      const words=this.state.words.slice();
      let el = document.getElementById(`line-${i}-word-${j}`);
      if (el) el.classList.add('cross-zoom-in');
      j++;
      if (j > words[i].length - 1) {
        j = 0;
        i++;
        if (i > words.length - 1) {
          clearInterval(animate);
          if (this.props.callback) {
            setTimeout(() => {
              let el = document.getElementById('full-title');
              if (el) el.classList.add('cross-zoom-out');
            }, 1000);
            setTimeout(this.props.callback, 1300);
          }
        }
      }
      this.setState({i, j});
    }, 150);
  }

  render() {

    const {words} = this.state;

    const renderedLines = words.map((line,i)=>{
      const renderedWords = line.map((word,j)=> {
        const display = this.state.i > i || (this.state.i === i && this.state.j >= j) ? 'inline' : 'none';
        return <div key={j} id={`line-${i}-word-${j}`} className="word" style={{display}}>
          {word}
        </div>
      });
      return <div key={i} className="line row">
        {renderedWords}
      </div>
    });

    return (
      <div className="impact no-scroll center-screen">
        <div className="column" id="full-title">
          {renderedLines}
        </div>
      </div>
    )
  }
}