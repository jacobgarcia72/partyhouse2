import React, { Component, Fragment } from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import Landing from './components/landing';
import UpdatePage from './components/UpdatePage';
import { games } from './config/games';
import NewGame from './components/game/other/new-game';
import {connect} from 'react-redux';
import Rejoin from './components/game/other/rejoin';
import PlayerCounter from './components/game/other/player-counter';
import Chat from './components/game/other/chat';
import RoomCode from './components/game/other/room-code';
import './style/style.sass';

class App extends Component {

  renderGameScreen = (props, game) => {
    if (this.props.code) {
      return (
        <div className="column">
          <div className="top-margin"></div>
          <div className="row blue-back fixed-top">
            <div className="row room-banner">
              <div className="left-icons">
                <img src="/assets/img/logo.png" alt="Party House Games"></img>
                <RoomCode roomCode={this.props.code}/>
              </div>
              <div className="right-icons">
                <PlayerCounter />
                <Chat />
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
            const { url, displayName, description, minPlayers, maxPlayers } = game;
            return <Fragment key={game.url}>
              <Route exact path={`/${game.url}`}
                render={props => <NewGame {...props} game={{ url, displayName, description, minPlayers, maxPlayers }} />}/>
              <Route exact path={`/${game.url}/:roomCode`}
                render={props => this.renderGameScreen(props, game)}/>
            </Fragment>
          })}
        </UpdatePage>
      </BrowserRouter>
    )
  }
}

function mapStateToProps({code, playerNeedsToJoinRoom}) {
  return { code, playerNeedsToJoinRoom };
}

export default connect(mapStateToProps, null)(App);
