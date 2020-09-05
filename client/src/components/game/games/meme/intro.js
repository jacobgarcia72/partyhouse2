import React, {Component} from 'react';
import { connect } from 'react-redux';
import Title from './Title';

class Intro extends Component {

  onAnimationFinish = () => {
    if (this.props.isHost) {
        this.props.nextScreen();
    }
  }

  render() {
    return <Title lines={['Welcome to', 'Dank U']} callback={this.onAnimationFinish} />
  }
}

function mapStateToProps({ isHost }) {
  return { isHost };
}

export default connect(mapStateToProps, null)(Intro);
