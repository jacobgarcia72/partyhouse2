import React, {Component} from 'react';
import { createNewRoom } from "../../../../functions/index";
import { FacebookProvider, Share } from 'react-facebook';
import './style.sass';

class NewGame extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerName: '',
      loading: false,
      share: false,
      roomUrl: ''
    }
  }

  componentDidMount() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      this.setState({playerName: 'Jacob'});
    }
  }

  createRoom = (event) => {
    event.preventDefault();
    this.setState({loading: true});
    const roomCode = this.getRoomCode();
    const { url } = this.props.game;
    createNewRoom(url, roomCode, this.state.playerName, newRoom => {
      const roomUrl = `/${url}/${roomCode.toLowerCase()}`;
      this.setState({roomUrl}, () => {
        if (this.state.share) {
          document.getElementById('share-btn').click();
        }
        this.props.history.push(roomUrl);
      });
    });
  }

  getRoomCode = ()=> {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      return "test";
    }
    let code = "";
    const possible = "abcdefghijklmnpqrstuvwxyz123456789";
    const censored = ['test','fuck','shit','dick','d1ck','cock','cunt','boob','slut','twat','nigg'];
  
    while (true) {
      code = "";
      for (let i = 0; i < 4; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      if (!censored.includes(code)) break;
    } 
    return code;
  }

  handleInputChange = event => {
    const { name, type, value, checked } = event.target;
    const newState = type === 'checkbox' ? checked : value;
    this.setState({
      [name]: newState
    });
  }

  render() {
    const { playerName, loading, roomUrl } = this.state;
    const { displayName, url } = this.props.game;
    return <div className="column NewGame">
      <img alt={displayName} src={`assets/img/thumbnails/${url}.png`} className="thumbnail" />
      <form onSubmit={this.createRoom} className="column">
        <FacebookProvider appId="1044229522678518">
          <Share href={`partyhouse.tv${roomUrl}`}>
            {({ handleClick, loading }) => (
              <button id="share-btn" type="button" disabled={loading} onClick={handleClick} style={{display: 'none'}}>Share</button>
            )}
          </Share>
        </FacebookProvider>
        <input
          className="input-name"
          placeholder="Name"
          type="text"
          maxLength="10"
          onChange={this.handleInputChange}
          autoComplete="off"
          spellCheck={false}
          name="playerName"
          value={playerName}
        ></input>
        <label class="checkbox-container">Share Room to Facebook
          <input
            name="share"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
          <span class="checkmark"></span>
        </label>
        <input
          type="submit"
          value="Create Room"
          disabled={playerName === '' || loading}
        ></input>
      </form>
    </div>;
  }
}

export default NewGame;
