import React, {Component} from 'react';
import { connect } from 'react-redux';

class Read extends Component {


  render() {
    return (
      <div className="read-story">
        
      </div>
    )
  }
}

function mapStateToProps({ gameState }) {
  return { gameState };
}

export default connect(mapStateToProps, null)(Read);