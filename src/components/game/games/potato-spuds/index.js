import React, {Component} from 'react';
import { createNewRoom } from "../../../../actions/index";

export default class Potato extends Component {

  roomCode = this.props.match.params.roomCode;

  componentDidMount() {
    createNewRoom(this.props.gameUrl, this.roomCode);
  }

  render() {
    return <div>Potatoes</div>;
  }
}