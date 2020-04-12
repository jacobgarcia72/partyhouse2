import {Component} from 'react';
import { connect } from 'react-redux';
import { setRoom } from '../../../../actions';
import { rejoinRoom } from "../../../../functions/index";

class Rejoin extends Component {

  roomCode = this.props.match.params.roomCode;

  componentDidMount() {
    rejoinRoom(this.roomCode, room => {
      if (room) {
        this.props.setRoom(room);
      } else {
        this.props.history.push('/');
      }
    });
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = {
  setRoom
}

export default connect(null, mapDispatchToProps)(Rejoin);