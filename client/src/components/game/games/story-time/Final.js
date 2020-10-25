import React, {Component} from 'react';
import { connect } from 'react-redux';
import { numberOfBackgroundImages } from './helpers';

class Final extends Component {

  interval;

  state = {
    backgroundImages: {
      story: '',
      moral: ''
    }
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.setState({backgroundImages: {
      story: this.getBackgroundImage(false),
      moral: this.getBackgroundImage(true)
    }});
  }

  getBackgroundImage = isForMoral => {
    let imageSrc;
    const { stories, morals } = numberOfBackgroundImages;
    if (isForMoral) {
      //if this is an image for the moral, choose from all available images 
      const totalImages = stories + morals;
      let rndX = Math.floor(Math.random() * totalImages);
      let directory;
      if (rndX < stories) {
        directory = 'stories';
      } else {
        directory = 'morals';
        rndX -= stories;
      }
      imageSrc = `/assets/img/storytime/${directory}/${rndX}.jpg`; 
    } else {
      imageSrc = `/assets/img/storytime/stories/${Math.floor(Math.random() * stories)}.jpg`; 
    }
    return `url(${imageSrc})`;
  }

  getHyphenatedShortenedCaption = () => {
    const { moral } = this.props.gameState;
    const strArr = moral.trim().replace(/[^a-zA-Z0-9 ]/g, '').split(' ').join('-').slice(0, 40).split('-');
    return strArr.slice(0, Math.max(5, strArr.length - 1)).join('-').toLowerCase().trim();
  }

  saveImage = (event, key) => {
    event.preventDefault();
    const element = document.getElementById(`save-image-${key}`);
    if (!element) return;
    this.interval = setTimeout(() => {
      const htmlToImage = require('html-to-image');
      const download = require('downloadjs');
      htmlToImage.toJpeg(element, { quality: 0.9 }).then(dataUrl=>{
        download(dataUrl, `party-house-story-${this.getHyphenatedShortenedCaption()}-${key}`);
      });
    }, 100);
  }

  renderDownloadableImage = (key, text, isForMoral, offscreenFullImage) => {
    const getImageContent = () => {
      const units = offscreenFullImage ? 'pt' : 'vw';
      let size = isForMoral ? Math.max(18, Math.round(-18 * Math.pow(text.length, 1 / 3.9) + 100)) : 17.5;
      if (!offscreenFullImage) size = size / 9;
      if (isForMoral) {
        const textArray = text.split(' ');
        return <div className="story-text" style={{fontSize: size + units}}>
          <div className="first-word" style={{fontSize: size * 1.1 + units}}>{textArray[0]}</div>
          {textArray.slice(1).join(' ')}
        </div>
      } else {
        return <div className="story-text" style={{fontSize: size + units}}>
          {text}
        </div>
      }
    }
    let className = 'save-image';
    if (isForMoral) className += ' moral';
    if (offscreenFullImage) className += ' saving';
    return (
      <div id={`${offscreenFullImage ? 'save' : 'display'}-image-${key}`} className={className}
        style={{
          backgroundImage: this.state.backgroundImages[isForMoral ? 'moral' : 'story']
        }}
      >
        <button id={`save-button-${key}`} onClick={e => this.saveImage(e, key)}>Save</button>
        <div className="story">
          {getImageContent()}
        </div>
        <div className="watermark">partyhouse.tv</div>
      </div>
    );
  }

  render() {
    const { gameState, isHost, continueGame, players } = this.props;
    const { story, moral } = gameState;
    return (
      <React.Fragment>
        <div className="column">
          <div className="row save-images">
            {this.renderDownloadableImage(0, story.join(' '), false, false)}
            {this.renderDownloadableImage(1, moral, true, false)}
          </div>
          {isHost && players.length >= 3 ? <button className="continue-btn" type="submit" onClick={continueGame}>Play Again</button> : null}
        </div>
        <div className="save-images off-screen">
          {this.renderDownloadableImage(0, story.join(' '), false, true)}
          {this.renderDownloadableImage(1, moral, true, true)}
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps({ gameState, isHost, players }) {
  return { gameState, isHost, players };
}

export default connect(mapStateToProps, null)(Final);