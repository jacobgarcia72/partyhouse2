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
      <h1>
        Welcome to
        <br />
        Story Time
      </h1>
    </div>
  }
}

function mapStateToProps({ isHost }) {
  return { isHost };
}

export default connect(mapStateToProps, null)(Intro);
