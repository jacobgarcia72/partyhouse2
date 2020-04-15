import React, {Component} from 'react';
import Lobby from '../../other/lobby';
import { screens } from './helpers';

export default class MemeGame extends Component {

  constructor(props) {
    super(props);
    this.state = {
      screen: screens.lobby
    }
  }

  nextScreen = screen => {
    this.setState({ screen });
  }

  render() {
    switch (this.state.screen) {
      case screens.lobby:
        return <Lobby onContinue={() => this.nextScreen(screens.intro)}/>;
      case screens.intro:
        return <p>Hello World</p>;
      default:
        return null;
    }
  }
}
