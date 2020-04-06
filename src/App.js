import React, { Component } from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Landing from './components/landing';

import ScrollToTop from './components/ScrollToTop';

import { games } from './config/games';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <ScrollToTop>
          <Route exact path="/" component={ Landing } />
          {games.map(game => <Route exact path={`/${game.url}/:roomCode`} key={game.url} render={props => <game.component {...props} 
            gameUrl={game.url}
          />}/>)}
        </ScrollToTop>
      </BrowserRouter>
    )
  }

}

export default App;


