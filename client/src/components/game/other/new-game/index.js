import React, {Component} from 'react';
import { createNewRoom, joinRoom } from "../../../../functions/index";
import { FacebookProvider, Share } from 'react-facebook';
import './style.sass';

class NewGame extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerName: '',
      loading: false,
      share: false,
      roomUrl: '',
      error: ''
    }
  }

  componentDidMount() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      this.setState({playerName: 'Jacob'});
    }
  }

  createRoom = (event) => {
    event.preventDefault();
    this.setState({loading: true, error: ''});
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

  joinRoom  = (event) => {
    event.preventDefault();
    this.setState({loading: true, error: ''});
    const roomCode = this.props.match.params.roomCode;
    joinRoom(roomCode, this.state.playerName, (roomExists, roomIsFull, room) => {
      let error = '';
      if (!roomExists) {
        error = `Couldn't find room code ${roomCode.toUpperCase()}.`;
      } else if (roomIsFull) {
        error = `Sorry. Room ${roomCode.toUpperCase()} is full.`;
      } else {
        this.props.history.push(`/${room.url}/${roomCode.toLowerCase()}`);
        return;
      }
      this.setState({error, loading: false});
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
    const { joiningExistingRoom } = this.props;
    const { displayName, url } = this.props.game;
    return <div className="column NewGame">
      <img alt={displayName} src={`/assets/img/thumbnails/${url}.png`} className="thumbnail" />
      <form onSubmit={joiningExistingRoom ? this.joinRoom : this.createRoom} className="column">
        { joiningExistingRoom ? null : (
          <FacebookProvider appId="1044229522678518">
            <Share href={`partyhouse.tv${roomUrl}`}>
              {({ handleClick, loading }) => (
                <button id="share-btn" type="button" disabled={loading} onClick={handleClick} style={{display: 'none'}}>Share</button>
              )}
            </Share>
          </FacebookProvider>
        )}
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
        { joiningExistingRoom ? null : (
          <label className="checkbox-container">Share Room to Facebook
            <input
              name="share"
              type="checkbox"
              checked={this.state.isGoing}
              onChange={this.handleInputChange}
            />
            <span className="checkmark"></span>
          </label>
        )}
        <input
          type="submit"
          value={joiningExistingRoom ? 'Join Game' : 'Create Room'}
          disabled={playerName === '' || loading}
        ></input>
        <div className="error">{this.state.error}</div>
      </form>
    </div>;
  }
}

export default NewGame;
