import React from 'react';

export default props => {
  return <div>
    <div style={{fontSize: '2rem'}}>
      {props.players.map(player => <div key={player.index}>{player.name}</div>)}
    </div>
  </div>;
}
