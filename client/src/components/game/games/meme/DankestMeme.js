import React, {Component} from 'react';
import { connect } from 'react-redux';
import { renderMeme } from './helpers';


// const testMeme = new Meme(0, 0, `/assets/img/meme/templates/1.jpg`);
// testMeme.captioner = 1;

class DankestMeme extends Component {

  constructor(props) {
    super(props);
    this.state = {
      memeAnimation: 'cross-zoom-in'
    }
    this.interval = null;
  }

  componentDidMount() {
    this.animateElements('dankest', 6, 1500);
    this.interval = setTimeout(() => {
      this.setState({ memeAnimation: 'cross-zoom-out' });
      this.animateElements('bonus-points', 2, 3000);
      if (this.props.isController) {
        this.interval = setTimeout(() => {
          this.props.nextScreen();
        }, 4000);
      }
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  animateElements = (elementName, finalElementIndex, pauseTime)=> {
    let counter = 0;
    let animate = setInterval(()=>{
      let element = document.getElementById(`${elementName}-${counter}`);
      if (element) {
        element.classList.add('cross-zoom-in');
      }
      counter++;
      if (counter > finalElementIndex) {
        clearInterval(animate);
        this.interval = setTimeout(() => {
          let fullElement = document.getElementById(elementName);
          if (fullElement) fullElement.classList.add('cross-zoom-out');
        }, pauseTime);
      }
    }, 150);
  }

  render() {
    const { memeAnimation } = this.state;
    const { gameState } = this.props;
    const { memes, dankestMemeIndex } = gameState;
    const meme = memes.find(m => m.index === dankestMemeIndex);
    return (
      <div className="no-scroll center-screen">
        {renderMeme(meme, 2, memeAnimation)}
        <div id="dankest" className="impact no-scroll center-screen row">
          <div id="dankest-0">D</div>
          <div id="dankest-1">A</div>
          <div id="dankest-2">N</div>
          <div id="dankest-3">K</div>
          <div id="dankest-4">E</div>
          <div id="dankest-5">S</div>
          <div id="dankest-6">T</div>
        </div>
        <div id="bonus-points" className="impact no-scroll center-screen">
          <div className="column">
            <div id="bonus-points-0">500 Bonus Points To:</div>
            <div id="bonus-points-1"><i className="fas fa-camera"></i>&nbsp;:&nbsp;{meme.uploaderName}</div>
            <div id="bonus-points-2"><i className="fas fa-edit"></i>&nbsp;:&nbsp;{meme.captionerName}</div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ gameState, code, isController, players }) {
  return { gameState, code, isController, players };
}

export default connect(mapStateToProps, null)(DankestMeme);