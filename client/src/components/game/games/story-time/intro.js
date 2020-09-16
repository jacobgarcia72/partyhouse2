import React, {Component} from 'react';
import { connect } from 'react-redux';

class Intro extends Component {

  state = {
    animateOut: false
  }

  intervals = [];

  componentDidMount() {
    this.intervals.push(setTimeout(() => {
      this.setState({animateOut: true});
    }, 4800));
    if (this.props.isHost) {
      this.intervals.push(setTimeout(() => {
        this.props.nextScreen();
      }, 5500));
    }
  }

  componentWillUnmount() {
    this.intervals.forEach(clearInterval);
  }

  render() {
    return <div className="center-screen no-scroll">
      <div className={`intro column${this.state.animateOut ? ' slide-down': ''}`}>
        <div className="welcome slide-in-from-left">Welcome to</div>
        <div className="title slide-in-from-right">Story Time!</div>
        <div className="description fade-in">Players will take turns writing the next line of the story and voting for which line gets added.</div>
      </div>
    </div>
  }
}

function mapStateToProps({ isHost }) {
  return { isHost };
}

export default connect(mapStateToProps, null)(Intro);
