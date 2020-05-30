import React, { Component, Fragment } from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import Landing from './components/landing';
import ScrollToTop from './components/ScrollToTop';
import { games } from './config/games';
import NewGame from './components/game/other/new-game';
import {connect} from 'react-redux';
import Rejoin from './components/game/other/rejoin';
import RoomCode from './components/game/other/room-code';
import './style/style.sass';

class App extends Component {

  renderGameScreen = (props, game) => {
    if (this.props.code) {
      return (
        <div className="column">
          <div className="row blue-back" style={{alignItems: 'center'}}>
            <RoomCode roomCode={this.props.code}/>
            <img src="/assets/img/logo.png" alt="Party House Games" style={{margin: '1em', height: '72px'}}></img>
          </div>
          <game.component {...props} gameUrl={game.url}/>
        </div>
      )
    } else {
      return <Rejoin {...props} />;
    }
  }

  render() {
    return (
      <BrowserRouter>
        <ScrollToTop>
          <Route exact path="/" render={props => <Landing  {...props}/> } />
          {games.map(game => {
            const { url, displayName } = game;
            return <Fragment key={game.url}>
              <Route exact path={`/${game.url}`}
                render={props => <NewGame {...props} game={{ url, displayName }} />}/>
              <Route exact path={`/${game.url}/:roomCode`}
                render={props => this.renderGameScreen(props, game)}/>
            </Fragment>
          })}
        </ScrollToTop>
      </BrowserRouter>
    )
  }
}

function mapStateToProps({code}) {
  return { code };
}

export default connect(mapStateToProps, null)(App);
