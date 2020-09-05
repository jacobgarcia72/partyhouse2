import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './style.sass';

import { joinRoom } from '../../functions';
import { games } from '../../config/games';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roomCode: '',
      playerName: '',
      error: '',
      loading: false
    }
  }

  componentDidMount() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      const names = ['Karen', 'Konnor', 'David', 'Emily', 'Stephen', 'Shayla', 'Jon', 'Debra', 'Brandon', 'Tasheda', 'Luis', 'Ethan', 'Fernando'];
      this.setState({roomCode: 'TEST', playerName: names[Math.floor(Math.random() * names.length)]});
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
    this.setState({loading: true});
    joinRoom(roomCode, playerName, (roomExists, roomIsFull, room) => {
      if (!roomExists) {
        error = `Couldn't find room code ${roomCode.toUpperCase()}.`;
      } else if (roomIsFull) {
        error = `Sorry. Room ${roomCode.toUpperCase()} is full.`;
      } else {
        this.props.history.push(`/${room.url}/${roomCode.toLowerCase()}`);
        return;
      }
      this.setState({error, loading: false});
    })
  }

  render() {
    const { roomCode, playerName, error, loading } = this.state;
    return (
      <div>
        <div className="row top-banner blue-back">
          <div className="column">
            <img src="assets/img/logo.png" alt="Party House Games"></img>
            <h1>Connect!</h1>
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
                disabled={roomCode === '' || playerName === '' || loading}
              ></input>
            </form>
            <div className="error">{error}</div>
          </div>
        </div>
        <h1>Create Room:</h1>
        <div className="thumbnails row">
          {games.map(game => <div key={game.url}>
            <Link to={game.url}>
              <img alt={game.displayName} src={`assets/img/thumbnails/${game.url}.png`} />
            </Link>
          </div>)}
        </div>
      </div>
    );
  }
};

export default Landing;