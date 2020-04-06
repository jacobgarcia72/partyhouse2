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

  connectRoom = event => {
    event.preventDefault();
    const { roomCode, playerName } = this.state;
    let error = roomCode.length < 4 ? 'Code must be 4 characters.' : '';
    this.setState({error});
    if (error) {
      return;
    }
    joinRoom(roomCode, playerName, (roomExists, roomIsFull, room, playerIndex) => {
      if (!roomExists) {
        error = `Couldn't find room code ${roomCode.toUpperCase()}.`;
      } else if (roomIsFull) {
        error = `Sorry. Room ${roomCode.toUpperCase()} is full.`;
      } else {
        this.props.history.push(`/${room.game.url}/${roomCode.toLowerCase()}`);
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
        {games.map(game => <Link to={game.url} key={game.url}>
          {game.displayName}
        </Link>)}
      </div>
    </div>;
  }
};

export default Landing;