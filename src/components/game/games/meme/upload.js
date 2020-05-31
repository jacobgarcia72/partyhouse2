import React, {Component} from 'react';
import { connect } from 'react-redux';
import { screens, assignCaptionersToMemes, Meme } from './helpers';
import { setGameState } from '../../../../functions/index';
import Crop from './Crop';
import { totalImages } from './helpers';

function buildFileSelector(){
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('accept', 'image/*');
  return fileSelector;
}

//select four indices for images
function selectIntegers(amount, max) {
  let res = [];
  while (res.length < amount) {
    const rndX = Math.floor(Math.random()*(max+1));
    if (!res.includes(rndX)) {
      res.push(rndX);
    }
  }
  return res;
}

class Upload extends Component {

  constructor(props) {
    super(props);

    const imageIndices = selectIntegers(8, totalImages-1);

    this.state = {
      uploads: [],
      currentImg: null,
      imageIndices
    }
  }

  componentDidMount(){
    this.fileSelector = buildFileSelector();
    this.fileSelector.addEventListener('change', this.openFile);
  }

  openFile = ()=> {
    const file = this.fileSelector.files[0];
    let reader  = new FileReader();
    reader.addEventListener("load", ()=> {
      this.setState({currentImg: reader.result});
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  handleFileSelect = (e) => {
    e.preventDefault();
    this.fileSelector.click();
  }

  handleSubmit = image => {
    const {code, playerIndex, gameState, players} = this.props;
    let {uploads} = this.state;
    uploads.push(image);
    this.setState({uploads});
    if (uploads.length===2) {
      let memes = gameState.memes || [];
      const images = uploads;
      const numPlayers = players.length;
      for (let i = 0; i < 2; i++) {
        let meme = new Meme(memes.length, playerIndex, images[i]);
        memes.push(meme);
      }
      if (memes.length === numPlayers * 2) {
        memes = assignCaptionersToMemes(memes, players);
        setGameState(code, { memes, screen: screens.caption });
      } else {
        setGameState(code, { memes });
      }
    }
  }

  handleNewImage = img => {
    window.scrollTo(0, 0);
    this.setState({ currentImg: null });
    if (img || img === 0) {
      this.handleSubmit(img);
    }
  }

  renderImages = ()=> {
    const uploadCount = this.state.uploads.length;
    const start = !uploadCount ? 0 : 4;
    const end = !uploadCount ? 4 : 8;
    const imageIndices = this.state.imageIndices.slice(start, end);
    return imageIndices.map(index=> <img alt="meme" key={index} src={`/assets/img/meme/templates/${index}.jpg`} onClick={()=>this.setState({currentImg:index})} />);
  };

  render() {
    const { currentImg, uploads } = this.state;
    if (uploads.length === 2) {
      return <div className="center-screen">
        <h2>Done. Waiting for other players.</h2>
      </div>
    }
    return <div>
      <div className="step">
        <div className="impact">Step 1:</div>
        <div className="impact large-font">Select Images</div>
      </div>
      {(currentImg || currentImg===0) ? <Crop img={currentImg} returnImage={this.handleNewImage} /> : null}
      <div className="row">
        <h2>{`Image ${this.state.uploads.length + 1} / 2`}</h2>
      </div>
      <div className="row">
        <button type="submit" onClick={this.handleFileSelect}>Upload Image</button>
      </div>
      <h2>
        Or select:
      </h2>
      <div className="images">
        {this.renderImages()}
      </div>
    </div>
  }
}

function mapStateToProps({ gameState, playerIndex, players, code }) {
  return { gameState, playerIndex, players, code };
}

export default connect(mapStateToProps, null)(Upload);
