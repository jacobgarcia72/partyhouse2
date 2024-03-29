import React, {Component} from 'react';
import { createNewRoom, joinRoom, isDevMode, getPlayCounts, setRoomListener } from "../../../../functions/index";
import { FacebookProvider, Share } from 'react-facebook';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import './style.sass';
import GameCard from '../game-card';
import store from '../../../../config/store';
import { setIsDisplay } from '../../../../actions';

class NewGame extends Component {

  constructor(props) {
    super(props);
    const state = {
      playerName: '',
      loading: false,
      share: false,
      roomUrl: '',
      error: '',
      partyModeSelected: !props.joiningExistingRoom && props.game.partyMode,
      remoteModeSelected: props.game.remoteMode && !props.game.partyMode
    };
    const { settings } = props.game;
    if (settings && settings.checkboxes) {
      settings.checkboxes.forEach(checkbox => {
        state[checkbox.name] = true;
      });
    }
    if (settings && settings.timers) {
      settings.timers.forEach(timer => {
        state[timer.name] = true;
        state[timer.name + 'Seconds'] = timer.default;
      });
    }
    this.state = state;
  }

  componentDidMount() {
    if (isDevMode()) {
      this.setState({playerName: 'Jacob'});
    }
    getPlayCounts();
  }

  createRoom = (event) => {
    event.preventDefault();
    this.setState({loading: true, error: ''});
    const roomCode = this.getRoomCode();
    const { url, settings } = this.props.game;
    const userSettings = {};
    if (settings && settings.checkboxes) {
      settings.checkboxes.forEach(checkbox => {
        userSettings[checkbox.name] = this.state[checkbox.name];
      });
    }
    if (settings && settings.timers) {
      settings.timers.forEach(timer => {
        userSettings[timer.name + 'Timer'] = this.state[timer.name];
        if (userSettings[timer.name + 'Timer']) {
          userSettings[timer.name + 'Seconds'] = Math.max(Math.min(999, this.state[timer.name + 'Seconds']), 10) + 1;
        }
      });
    }
    const { partyModeSelected } = this.state;
    createNewRoom(url, roomCode, userSettings, partyModeSelected, newRoom => {
      const roomUrl = `/${url}/${roomCode.toLowerCase()}`;
      this.setState({roomUrl}, () => {
        if (this.state.share) {
          document.getElementById('share-btn').click();
        }
        this.props.history.push(roomUrl);
      });
      if (partyModeSelected) {
        store.dispatch(setIsDisplay());
        setRoomListener(roomCode);
      } else {
        joinRoom(roomCode, this.state.playerName);
      }
    });
  }

  joinRoom  = (event) => {
    event.preventDefault();
    this.setState({loading: true, error: ''});
    const roomCode = this.props.match.params.roomCode;
    const bannedRoom = localStorage.getItem('banned');
    if (bannedRoom && bannedRoom.toLowerCase() === roomCode.toLowerCase()) {
      this.setState({loading: false, error: 'Cannot rejoin room.'});
      return;
    }
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
    if (isDevMode()) {
      return "test";
    }
    let code = "";
    const possible = "abcdefghijklmnpqrstuvwxyz123456789";
    const censored = ['test','fuck','shit','dick','d1ck','cock','cunt','boob','slut','twat','nigg','nggr','s1ut'];
  
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
    let newState = type === 'checkbox' ? checked : value;
    this.setState({
      [name]: newState
    });
  }

  onDefocus = event => {
    const { name, type, value, checked } = event.target;
    let newState = type === 'checkbox' ? checked : value;
    if (type === 'number') {
      newState = Math.max(Math.min(999, newState), 10);
      this.setState({
        [name]: newState
      });
    }
  }

  renderModeOptions = () => {
    const { partyMode, remoteMode } = this.props.game;
    return (
      <div className="row">
        {partyMode && (
          <div onClick={() => {
            this.setState({ partyModeSelected: true, remoteModeSelected: false })
          }} className={`mode-option ${this.state.partyModeSelected && 'mode-option-selected'}`}>
            <h1>Party Mode</h1>
            <p>This device will be used as a shared screen.</p>
          </div>
        )}
        {remoteMode && (
          <div onClick={() => {
            this.setState({ partyModeSelected: false, remoteModeSelected: true })
          }} className={`mode-option ${this.state.remoteModeSelected && 'mode-option-selected'}`}>
            <h1>Remote Mode</h1>
            <p>Players connect remotely with no need for a shared screen.</p>
          </div>
        )}
      </div>
    )
  }

  renderSettings = () => {
    const { settings } = this.props.game;
    if (!settings) {
      return;
    }
    const checkboxes = settings.checkboxes || [];
    const timers = settings.timers || [];
    return (
      <div className="settings column">
        <div className="settings-title">Settings</div>
        {checkboxes.map((checkbox, i) => (
        <div className="row setting" key={i}>
          <label className="checkbox-container">&nbsp;{checkbox.text}
            <input
              name={checkbox.name}
              type="checkbox"
              checked={this.state[checkbox.name]}
              onChange={this.handleInputChange}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        ))}
        {timers.map((timer, i) => (
        <div className="row setting timer-setting" key={i}>
          <label className="checkbox-container">
            <input
              id={timer.name}
              name={timer.name}
              type="checkbox"
              checked={this.state[timer.name]}
              onChange={this.handleInputChange}
            />
            <span className="checkmark"></span>
          </label>
          <input type="number"
            disabled={!this.state[timer.name]}
            name={timer.name + 'Seconds'}
            value={this.state[timer.name + 'Seconds']}
            onChange={this.handleInputChange}
            onBlur={this.onDefocus}
            min={10}
            max={999}
          ></input>
          <div onClick={() => document.getElementById(timer.name).click()}
            style={{cursor: 'pointer'}}>-Second {timer.name} Timer</div>
        </div>
        ))}
      </div>
    )
  }

  render() {
    const { playerName, loading, roomUrl, partyModeSelected } = this.state;
    const { joiningExistingRoom, playCounts, game } = this.props;
    return <div className="column NewGame">
      <Link to="/">
        <img className="logo" src="/assets/img/logo2.svg" alt="Party House Home" />
      </Link>
      <GameCard game={game} playCounts={playCounts} />
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
        { !joiningExistingRoom && this.renderModeOptions()}
        { !partyModeSelected && (
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
        )}
        { joiningExistingRoom ? null : (
          <React.Fragment>
            {this.renderSettings()}
            <div className="share-option-row">
              <label className="checkbox-container">Share Room to Facebook
                <input
                  name="share"
                  type="checkbox"
                  checked={this.state.share}
                  onChange={this.handleInputChange}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          </React.Fragment>
        )}
        <input
          type="submit"
          value={joiningExistingRoom ? 'Join Game' : 'Create Room'}
          disabled={(playerName === '' && !partyModeSelected) || loading}
        ></input>
        <div className="error">{this.state.error}</div>
      </form>
    </div>;
  }
}

function mapStateToProps({ playCounts }) {
  return { playCounts };
}

export default connect(mapStateToProps, null)(NewGame);
