import React, {Component} from 'react';
import { rejoinRoom } from "../../../../functions/index";
import Loader from '../../../loader';

class Rejoin extends Component {

  roomCode = this.props.match.params.roomCode;

  componentDidMount() {
    rejoinRoom(this.roomCode, room => {
      if (!room) {
        this.props.history.push('/');
      }
    });
  }

  render() {
    return <div className="center-screen"><Loader /></div>;
  }
}

export default Rejoin;
