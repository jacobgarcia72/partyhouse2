import React, {Component} from 'react';
import { createNewRoom } from "../../../../functions/index";
import './style.sass';

class NewGame extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerName: '',
      loading: false
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
      this.props.history.push(`/${url}/${roomCode.toLowerCase()}`);
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
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  }

  render() {
    const { playerName, loading } = this.state;
    const { displayName, url } = this.props.game;
    return <div className="column NewGame">
      <img alt={displayName} src={`assets/img/thumbnails/${url}.png`} className="thumbnail" />
      <form onSubmit={this.createRoom} className="column">
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
