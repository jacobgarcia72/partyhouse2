import React, { Component, Fragment } from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import Landing from './components/landing';
import ScrollToTop from './components/ScrollToTop';
import { games } from './config/games';
import NewGame from './components/game/other/new-game';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <ScrollToTop>
          <Route exact path="/" component={ Landing } />
          {games.map(game => {
            const { url, displayName } = game;
            return <Fragment key={game.url}>
              <Route exact path={`/${game.url}`}
                render={props => <NewGame {...props} game={{ url, displayName }} />}/>
              <Route exact path={`/${game.url}/:roomCode`}
                render={props => <game.component {...props} gameUrl={url}/>}/>
            </Fragment> 
          })}
        </ScrollToTop>
      </BrowserRouter>
    )
  }
}

export default App;


