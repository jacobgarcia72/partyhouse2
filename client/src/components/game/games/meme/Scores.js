import React, {Component} from 'react';
import { connect } from 'react-redux';

class Scores extends Component {

  interval;

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getHyphenatedShortenedCaption = caption => {
    const strArr = caption.trim().replace(/[^a-zA-Z0-9 ]/g, '').split(' ').join('-').slice(0, 40).split('-');
    return strArr.slice(0, Math.max(5, strArr.length - 1)).join('-').toLowerCase().trim();
  }

  saveMeme = (meme) => {
    const element = document.getElementById(`save-meme-${meme.index}`);
    if (!element) return;
    this.interval = setTimeout(() => {
      const htmlToImage = require('html-to-image');
      const download = require('downloadjs');
      htmlToImage.toJpeg(element, { quality: 0.9 }).then(dataUrl=>{
        download(dataUrl, `party-house-dank-u-${this.getHyphenatedShortenedCaption(meme.caption)}`);
      });
    }, 0);
  }

  renderMemesToSave = (offscreen)=> {
    let renderedMemes = null;
    const {memes} = this.props.gameState;
    if (memes) {
      renderedMemes =  memes.map((meme)=>{
        let memeClassName = 'save-meme meme';
        if (offscreen) {
          memeClassName += ' saving'
        }
        return (
          <div className="save-meme-container" key={meme.index}>
            <div key={meme.index} id={`${offscreen ? 'save' : 'display'}-meme-${meme.index}`} className={memeClassName}>
              <button id={`save-button-${meme.index}`} onClick={() => this.saveMeme(meme)}>Save</button>
              <div className="caption">{meme.caption}</div>
              <img alt="meme" src={Number.isInteger(meme.image) ? `/assets/img/meme/templates/${meme.image}.jpg` : meme.image} />
              <div className="watermark">partyhouse.tv</div>
            </div>
          </div>
        )
      });
    }
    let className = 'save-memes';
    if (offscreen) {
      className += ' off-screen';
    }
    return <div className={className} id="save-content">{renderedMemes}</div>
  }

  render() {
    const { gameState, isHost, continueGame, players } = this.props;
    const minPlayers = 3;
    return (
      <div className="scores column">
        {gameState.scores.map((s, i) => <div key={i}>{s.playerName}: {s.points}</div>)}
        {this.renderMemesToSave(false)}
        {this.renderMemesToSave(true)}
        {isHost && players.length >= minPlayers ? <button className="continue-btn" type="submit" onClick={continueGame}>Continue Game</button> : null}
      </div>
    )
  }
}

function mapStateToProps({ gameState, isHost, players }) {
  return { gameState, isHost, players };
}

export default connect(mapStateToProps, null)(Scores);