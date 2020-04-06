import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./style.sass";

import { joinRoom } from '../../actions';
import { games } from '../../config/games';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roomCode: '',
      playerName: '',
      error: ''
    }
  }

  handleInputChange = event => {
    const {name, value} = event.target;
    this.setState({
      [name]: name === 'roomCode' ? value.toUpperCase() : value
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

  connectRoom = event => {
    event.preventDefault();
    const { roomCode, playerName } = this.state;
    let error = roomCode.length < 4 ? 'Code must be 4 characters.' : '';
    this.setState({error});
    if (error) {
      return;
    }
    joinRoom(roomCode, playerName, (roomExists, roomIsFull, playerIndex) => {
      if (!roomExists) {
        error = `Couldn't find room code ${roomCode.toUpperCase()}.`;
      } else if (roomIsFull) {
        error = `Sorry. Room ${roomCode.toUpperCase()} is full.`;
      } else {
        this.props.history.push(`/connect/${roomCode.toLowerCase()}`);
        return;
      }
      this.setState({error});
    })
  }

  render() {
    const { roomCode, playerName, error } = this.state;
    return <div>
      <div className="row top-banner">
        <div className="column">
          <img src="assets/img/logo.png" alt="Party House Games"></img>
          <div className="connect">Connect!</div>
          <form onSubmit={this.connectRoom}>
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
              className="input-code"
              placeholder="Code"
              type="text"
              maxLength="4"
              onChange={this.handleInputChange}
              autoComplete="off"
              spellCheck={false}
              name="roomCode"
              value={roomCode}
            ></input>
            <input
              type="submit"
              value="Go"
              disabled={roomCode === '' || playerName === ''}
            ></input>
          </form>
          <div className="error">{error}</div>
        </div>
      </div>
      <div>
        {games.map(game => <Link to={`${game.url}/${this.getRoomCode()}`} key={game.url}>
          {game.displayName}
        </Link>)}
      </div>
    </div>;
  }
};

export default Landing;