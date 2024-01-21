import React from 'react';
import { connect } from 'react-redux';
import Title from './Title';

const Intro = (props) => {

  const onAnimationFinish = () => {
    if (props.isController) {
        props.nextScreen();
    }
  }
  return <Title lines={['Welcome to', 'Dank U']} callback={onAnimationFinish} />
}

function mapStateToProps({ isController }) {
  return { isController };
}

export default connect(mapStateToProps, null)(Intro);
