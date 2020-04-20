import React, {Component} from 'react';
import Lobby from '../../other/lobby';
import { screens } from './helpers';
import { setScreen } from '../../../../functions/index';
import { connect } from 'react-redux';

class ChooseCategory extends Component {

  nextScreen = screen => {
    setScreen(this.props.room.code, screen);
  }

  render() {
    return <div>Choose Category</div>
  }
}

function mapStateToProps({ room }) {
  return { room };
}

export default connect(mapStateToProps, null)(ChooseCategory);
