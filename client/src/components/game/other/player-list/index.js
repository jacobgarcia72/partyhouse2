import React, { Component } from 'react';
import {connect} from 'react-redux';
import './style.sass';
import { removePlayerFromRoom } from '../../../../functions';

class PlayerList extends Component {

  state = {
    bootPlayer: null
  }

  selectBootOption = (remove, ban) => {
    if (remove) {
      removePlayerFromRoom(this.props.code, this.state.bootPlayer.index, ban);
    }
    this.setState({bootPlayer: null});
    if (this.props.callback) this.props.callback();
  }

  render() {
    return <div className="column player-list">
      {this.state.bootPlayer ? (
        <div className="cover-screen no-scroll">
          <div className="boot-player column">
            <div>Remove {this.state.bootPlayer.name} from the room?</div>
            <div className="row boot-options">
              <button className="boot-option" onClick={() => this.selectBootOption(true, false)}>Remove</button>
              <button className="boot-option" onClick={() => this.selectBootOption(true, true)}>Ban</button>
              <button className="boot-option" onClick={() => this.selectBootOption(false, false)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
      <h2>{this.props.title || 'Players'}:</h2>
      <div style={{fontSize: '2rem', minHeight: '160px', width: '90vw', textAlign: 'center'}}>
          {this.props.players.map(player => (
            <div key={player.index} className="row player-row">
              {this.props.allowBoot && player.index !== this.props.playerIndex ? (
                <div className="x"><i className="fas fa-times" onClick={() => this.setState({bootPlayer: player})}></i></div>
              ) : <div className="x-space"></div>}
              &nbsp;&nbsp;{player.name}
            </div>
          ))}
        </div>
    </div>;
  }
}

function mapStateToProps({players, playerIndex, code }) {
  return { players, playerIndex, code  };
}

export default connect(mapStateToProps, null)(PlayerList);
