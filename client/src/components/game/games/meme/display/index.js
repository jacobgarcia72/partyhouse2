import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { playMusic, playVideo } from '../../../../../functions';

import Player from '../../../../media/Player';

const MemeGame = () => {

  useEffect(() => {
    playMusic('lobby');
    playVideo('intro');
  }, []);

  return <div>
    <Player />
  </div>
}

function mapStateToProps({ gameState }) {
  return { gameState };
}

export default connect(mapStateToProps, null)(MemeGame);
