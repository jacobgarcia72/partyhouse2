import React, {Component} from 'react';
import PlayerList from '../player-list';
import {connect} from 'react-redux';
import './style.sass';

class PlayerCounter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPlayerList: false
    };
  }

  render() {
    return (
      <React.Fragment>
        {this.state.showPlayerList ? (
        <div className="active-player-list column" onClick={() => this.setState({showPlayerList: false})}>
          <PlayerList title={'Online Players'}/>
        </div>
        ) : null}
        <div className="player-counter" onClick={() => this.setState({showPlayerList: !this.state.showPlayerList})}>
          <i className="fas fa-users"></i>
          <div className="counter">
            {this.props.players.length}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps({ players }) {
  return { players };
}

export default connect(mapStateToProps, null)(PlayerCounter);
