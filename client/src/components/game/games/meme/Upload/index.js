import React from 'react';
import { connect } from 'react-redux';
import Display from './display';
import Device from './device';

const Upload = ({ isDisplay }) => isDisplay ? <Display /> : <Device />;

function mapStateToProps({ isDisplay }) {
  return { isDisplay };
}

export default connect(mapStateToProps, null)(Upload);
