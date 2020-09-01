import React, {Component} from 'react';
import { connect } from 'react-redux';

class Scores extends Component {

  getHyphenatedShortenedCaption = caption => {
    const strArr = caption.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').join('-').slice(0, 40).split('-');
    return strArr.slice(0, strArr.length - 1).join('-').toLowerCase();
  }

  saveMeme = (meme) => {
    const element = document.getElementById(`save-meme-${meme.index}`);
    if (!element) return;
    element.classList.add('saving');
    setTimeout(() => {
      const htmlToImage = require('html-to-image');
      const download = require('downloadjs');
      htmlToImage.toJpeg(element, { quality: 0.9 }).then(dataUrl=>{
        download(dataUrl, `party-house-dank-u-${this.getHyphenatedShortenedCaption(meme.caption)}`);
        element.classList.remove('saving');
      });
    }, 0);
  }

  renderMemesToSave = ()=> {
    let renderedMemes = null;
    const {memes} = this.props.gameState;
    if (memes) {
      renderedMemes =  memes.map((meme)=>{
        return (
          <div className="save-meme-container">
            <div key={meme.index} id={`save-meme-${meme.index}`} className="save-meme meme">
              <button id={`save-button-${meme.index}`} onClick={() => this.saveMeme(meme)}>Save</button>
              <div className="caption">{meme.caption}</div>
              <img alt="meme" src={Number.isInteger(meme.image) ? `/assets/img/meme/templates/${meme.image}.jpg` : meme.image} />
              <div className="watermark">partyhouse.tv</div>
            </div>
          </div>
        )
      });
    } 
    return <div className="save-memes" id="save-content">{renderedMemes}</div>
  }

  render() {
    const { gameState, isHost, continueGame, players } = this.props;
    const minPlayers = 3;
    return (
      <div className="scores column">
        {gameState.scores.map((s, i) => <div key={i}>{s.playerName}: {s.points}</div>)}
        {this.renderMemesToSave()}
        {isHost && players.length >= minPlayers ? <button className="continue-btn" type="submit" onClick={continueGame}>Continue Game</button> : null}
      </div>
    )
  }
}

function mapStateToProps({ gameState, isHost, players }) {
  return { gameState, isHost, players };
}

export default connect(mapStateToProps, null)(Scores);