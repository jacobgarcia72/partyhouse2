import { actions } from '../../actions';

const initialState = {
  room: {}
} 

export default (state = initialState, action) => {
  console.log(action)
  console.log(state)
  const setState = newState => Object.assign({}, state, newState);
  switch (action.type) {
    case actions.SET_ROOM: 
      return setState({room: action.payload});
    default:
      return state
  }
}