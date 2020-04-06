import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./style.sass";

import { games } from '../../config/games';

class Landing extends Component {

  getRoomCode = ()=> {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      return "test";
    }
    let code = "";
    const possible = "abcdefghijklmnpqrstuvwxyz123456789";
    const censored = ['test','fuck','shit','dick','d1ck','cock','cunt','boob','slut','twat','nigg'];
  
    while (true) {
      code = "";
      for (let i = 0; i < 4; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      if (!censored.includes(code)) break;
    } 
    return code;
  }

  render() {
    return <div>
      <div className="row top-banner">
        <div className="column">
          <img src="assets/img/logo.png" alt="Party House Games"></img>
          <div>Connect!</div>
          <input placeholder="Code" type="text" maxLength="4"></input>
        </div>
      </div>
      <div>
        {games.map(game => <Link to={`${game.url}/${this.getRoomCode()}`}>
          {game.displayName}
        </Link>)}
      </div>
    </div>;
  }
};

export default Landing;