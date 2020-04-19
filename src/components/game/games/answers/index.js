import React, {Component} from 'react';
import Lobby from '../../other/lobby';
import { screens } from './helpers';
import { setScreen } from '../../../../functions/index';
import { connect } from 'react-redux';

class HonestAnswers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      screen: screens.lobby
    }
  }

  nextScreen = screen => {
    setScreen(this.props.room.code, screen);
  }

  render() {
    switch (this.props.room.screen) {
      case screens.lobby:
        return <Lobby onContinue={() => this.nextScreen(screens.intro)}/>;
      case screens.intro:
        return <p>Hello World</p>;
      default:
        return null;
    }
  }
}

function mapStateToProps({ room }) {
  return { room };
}

export default connect(mapStateToProps, null)(HonestAnswers);
