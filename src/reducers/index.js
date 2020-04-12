import { actions } from '../actions';

const initialState = {
  room: {}
} 

export default (state = initialState, action) => {
  const setState = newState => Object.assign({}, state, newState);
  switch (action.type) {
    case actions.SET_ROOM: 
      return setState({room: action.payload});
    default:
      return state
  }
}