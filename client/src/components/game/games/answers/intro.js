import React, {Component} from 'react';
import { connect } from 'react-redux';

class Intro extends Component {

  interval;

  componentDidMount() {
    if (this.props.isHost) {
      this.interval = setTimeout(() => {
        this.props.nextScreen();
      }, 2500);
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

  render() {
    return <div>
      <h1>
        Welcome to
        <br />
        Honest Answers
      </h1>
    </div>
  }
}

function mapStateToProps({ isHost }) {
  return { isHost };
}

export default connect(mapStateToProps, null)(Intro);
