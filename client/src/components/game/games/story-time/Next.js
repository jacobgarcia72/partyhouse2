import React, {Component} from 'react';
import { connect } from 'react-redux';

class Next extends Component {


  render() {
    const { prompt, writers } = this.props.gameState;
    return (
      <div className="cover-screen cover-screen-light">
        <div className="column">
          <div>Next Line:</div>
          <div className="next-prompt">{prompt}...</div>
          <div>These players will finish the sentence:</div>
          <div className="column next-players">
            {writers.map((p, i) => <div key={i}>{p.name}</div>)}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ gameState }) {
  return { gameState };
}

export default connect(mapStateToProps, null)(Next);