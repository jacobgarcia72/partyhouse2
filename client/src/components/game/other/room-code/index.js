import React from 'react';

export default props => {
  return <div style={{padding: '12px'}}>
    Room Code:
    <div style={{fontSize: '2rem', lineHeight: 1}}>
      {props.roomCode.toUpperCase()}
    </div>
  </div>;
}
