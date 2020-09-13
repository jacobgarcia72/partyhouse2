import React, {Component} from 'react';
import { connect } from 'react-redux';

class Read extends Component {


  render() {
    const { story } = this.props.gameState;
    return (
      <div className="read-story-container row">
        <div className="read-story">
          {story.join(' ')}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ gameState }) {
  return { gameState };
}

export default connect(mapStateToProps, null)(Read);