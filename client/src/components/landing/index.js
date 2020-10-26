import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './style.sass';

import { joinRoom, isDevMode, getPlayCounts } from '../../functions';
import { games } from '../../config/games';
import GameCard from '../game/other/game-card';
import {connect} from 'react-redux';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roomCode: '',
      playerName: '',
      error: '',
      loading: false
    };
    this.games = isDevMode() ? games : games.filter(g => g.public);
  }

  componentDidMount() {
    if (isDevMode()) {
      const names = ['Karen', 'Konnor', 'David', 'Emily', 'Stephen', 'Shayla', 'Jon', 'Debra', 'Brandon', 'Tasheda', 'Luis', 'Ethan', 'Fernando', 'Cliff', 'Savanna', 'Allie', 'Justin', 'Heather', 'Brett'];
      this.setState({roomCode: 'TEST', playerName: names[Math.floor(Math.random() * names.length)]});
    }
    getPlayCounts();
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
    const bannedRoom = localStorage.getItem('banned');
    if (bannedRoom && bannedRoom.toLowerCase() === roomCode.toLowerCase()) {
      error = 'Cannot rejoin room.';
    }
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
            <form onSubmit={this.connectRoom} className="row">
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
              <div>
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
              </div>
            </form>
            <div className="error">{error}</div>
          </div>
        </div>
        <h1>Create Room:</h1>
        <div className="thumbnails row">
          {this.games.map(game => <div key={game.url}>
            <Link to={game.url}>
              <GameCard game={game} playCounts={this.props.playCounts} abbreviated={true} />
            </Link>
          </div>)}
        </div>
      </div>
    );
  }
};

function mapStateToProps({ playCounts }) {
  return { playCounts };
}

export default connect(mapStateToProps, null)(Landing);
