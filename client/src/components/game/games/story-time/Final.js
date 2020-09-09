import React, {Component} from 'react';
import { connect } from 'react-redux';

class Final extends Component {


  render() {
    return (
      <div>
        Hello
      </div>
    )
  }
}

function mapStateToProps({ gameState }) {
  return { gameState };
}

export default connect(mapStateToProps, null)(Final);