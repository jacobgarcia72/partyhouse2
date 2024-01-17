import React, { useState } from 'react';
import {connect} from 'react-redux';
import './style.sass';
import { removePlayerFromRoom } from '../../../../functions';

const PlayerList = (props) => {

  const [bootPlayer, setBootPlayer] = useState(null);

  const selectBootOption = (remove, ban) => {
    if (remove) {
      removePlayerFromRoom(props.code, bootPlayer.index, ban);
    }
    setBootPlayer(null);
    if (props.callback) props.callback();
  }

  return <div className="column player-list">
    {bootPlayer ? (
      <div className="cover-screen no-scroll">
        <div className="boot-player column">
          <div>Remove {bootPlayer.name} from the room?</div>
          <div className="row boot-options">
            <button className="boot-option" onClick={() => selectBootOption(true, false)}>Remove</button>
            <button className="boot-option" onClick={() => selectBootOption(true, true)}>Ban</button>
            <button className="boot-option" onClick={() => selectBootOption(false, false)}>Cancel</button>
          </div>
        </div>
      </div>
    ) : null}
    <h2>{props.title || 'Players'}:</h2>
    <div style={{fontSize: '2rem', minHeight: '160px', width: '90vw', textAlign: 'center'}}>
        {props.players.map(player => (
          <div key={player.index} className="row player-row">
            {props.allowBoot && player.index !== props.playerIndex ? (
              <div className="x"><i className="fas fa-times" onClick={() => setBootPlayer(player)}></i></div>
            ) : <div className="x-space"></div>}
            &nbsp;&nbsp;{player.name}
          </div>
        ))}
      </div>
  </div>;
}

function mapStateToProps({players, playerIndex, code }) {
  return { players, playerIndex, code  };
}

export default connect(mapStateToProps, null)(PlayerList);
