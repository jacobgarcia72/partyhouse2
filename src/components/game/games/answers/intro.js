import React, {Component} from 'react';
import { connect } from 'react-redux';

class Intro extends Component {

  componentDidMount() {
    if (this.props.isHost) {
      setTimeout(() => {
        this.props.nextScreen();
      }, 2500);
    }
  }

  render() {
    return <div>
      <div>
        Welcome to
      </div>
      <div>
        Honest Answers
      </div>
    </div>
  }
}

function mapStateToProps({ isHost }) {
  return { isHost };
}

export default connect(mapStateToProps, null)(Intro);
