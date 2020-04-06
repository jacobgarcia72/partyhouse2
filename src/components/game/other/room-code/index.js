import React from 'react';

export default props => {
  return <div>
    Room Code:
    <div style={{fontSize: '2rem'}}>
      {props.roomCode.toUpperCase()}
    </div>
  </div>;
}
