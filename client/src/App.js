import React, { Component, Fragment } from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import Landing from './components/landing';
import UpdatePage from './components/UpdatePage';
import { games } from './config/games';
import NewGame from './components/game/other/new-game';
import {connect} from 'react-redux';
import Rejoin from './components/game/other/rejoin';
import PlayerCounter from './components/game/other/player-counter';
import TimerCountDown from './components/game/other/timer-count-down';
import Chat from './components/game/other/chat';
import RoomCode from './components/game/other/room-code';
import './style/style.sass';

class App extends Component {

  getGameProps = game => {
    const { url, displayName, description, minPlayers, maxPlayers, partyMode, remoteMode } = game;
    const settings = game.settings || {};
    settings.checkboxes = settings.checkboxes || [];
    if (!settings.checkboxes.find(c => c.name === 'enableChat')) {
      settings.checkboxes.unshift({ name: 'enableChat', text: 'Enable Chat' });
    }
    return { url, displayName, description, minPlayers, maxPlayers, partyMode, remoteMode, settings };
  }

  renderGameScreen = (props, game) => {
    if (this.props.code) {
      return (
        <div className="column">
          <div className="top-margin"></div>
          <div className="row blue-back fixed-top">
            <div className="row room-banner">
              <TimerCountDown />
              <div className="left-icons">
                <img src="/assets/img/logo.png" alt="Party House Games"></img>
                <RoomCode roomCode={this.props.code}/>
              </div>
              <div className="right-icons">
                <PlayerCounter />
                {this.props.gameState.settings.enableChat ? <Chat /> : null}
              </div>
            </div>
          </div>
          <game.component {...props} gameUrl={game.url}/>
        </div>
      )
    } else if (this.props.playerNeedsToJoinRoom) {
      return <NewGame {...props} game={game} joiningExistingRoom={true} />
    } else {
      return <Rejoin {...props} />;
    }
  }

  render() {
    return (
      <BrowserRouter>
        <UpdatePage>
          <Route exact path="/" render={props => <Landing  {...props}/> } />
          {games.map(game => {
            const gameProps = this.getGameProps(game);
            return <Fragment key={game.url}>
              <Route exact path={`/${game.url}`}
                render={props => <NewGame {...props} game={gameProps} />}/>
              <Route exact path={`/${game.url}/:roomCode`}
                render={props => this.renderGameScreen(props, game)}/>
            </Fragment>
          })}
        </UpdatePage>
      </BrowserRouter>
    )
  }
}

function mapStateToProps({code, playerNeedsToJoinRoom, gameState}) {
  return { code, playerNeedsToJoinRoom, gameState };
}

export default connect(mapStateToProps, null)(App);
