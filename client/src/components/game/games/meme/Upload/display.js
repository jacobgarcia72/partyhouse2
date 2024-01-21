import React from 'react';
import { connect } from 'react-redux';

const UploadDisplay = (props) => {
    return <div>
      <div className="step">
        <div className="impact">Step 1:</div>
        <div className="impact large-font">Select Images</div>
      </div>
        <div className="column">
          <h2>Waiting for:</h2>
          <div className="waiting-for-list">
            {(props.gameState.waitingFor || [])
              .map((p, i) => <div key={i}>{p.name}</div>)}
          </div>
        </div>
    </div>
}

function mapStateToProps({ gameState }) {
  return { gameState };
}

export default connect(mapStateToProps, null)(UploadDisplay);
