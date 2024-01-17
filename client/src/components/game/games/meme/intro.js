import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { playMusic } from '../../../../functions';
import Title from './Title';

const Intro = (props) => {

  useEffect(() => {
    playMusic('main');
  }, []);

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
