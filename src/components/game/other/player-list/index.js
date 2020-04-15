import React, { Component } from 'react';
import {connect} from 'react-redux';

class PlayerList extends Component {
  render() {
    return <div>
      <div style={{fontSize: '2rem'}}>
        {this.props.players.map(player => <div key={player.index}>{player.name}</div>)}
      </div>
    </div>;
  }
}

function mapStateToProps({players}) {
  return { players };
}

export default connect(mapStateToProps, null)(PlayerList);
