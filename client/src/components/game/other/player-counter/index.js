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

  togglePlayerList = () => {
    const showPlayerList = !this.state.showPlayerList;
    this.setState({showPlayerList});
    document.body.style.overflow = showPlayerList ? 'hidden' : 'auto';
  }

  render() {
    const { showPlayerList } = this.state;
    return (
      <React.Fragment>
        {showPlayerList ? (
        <div className="active-player-list column">
          <PlayerList title={'Online Players'} allowBoot={this.props.isHost} callback={this.togglePlayerList} />
        </div>
        ) : null}
        <div className={`player-counter ${showPlayerList && 'active'}`} onClick={this.togglePlayerList}>
          <i className="fas fa-users"></i>
          <div className="counter">
            {this.props.players.length}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps({ players, isHost }) {
  return { players, isHost };
}

export default connect(mapStateToProps, null)(PlayerCounter);
