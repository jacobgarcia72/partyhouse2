import React, { Component, Fragment } from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import Landing from './components/landing';
import ScrollToTop from './components/ScrollToTop';
import { games } from './config/games';
import NewGame from './components/game/other/new-game';
import {connect} from 'react-redux';
import Rejoin from './components/game/other/rejoin';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <ScrollToTop>
          <Route exact path="/" render={props => <Landing  {...props}/> } />
          {games.map(game => {
            const { url, displayName } = game;
            const getComponent = props => this.props.room ? <game.component {...props} gameUrl={url}/> : <Rejoin {...props} />;
            return <Fragment key={game.url}>
              <Route exact path={`/${game.url}`}
                render={props => <NewGame {...props} game={{ url, displayName }} />}/>
              <Route exact path={`/${game.url}/:roomCode`}
                render={props => getComponent(props)}/>
            </Fragment>
          })}
        </ScrollToTop>
      </BrowserRouter>
    )
  }
}

function mapStateToProps({room}) {
  return { room };
}

export default connect(mapStateToProps, null)(App);
