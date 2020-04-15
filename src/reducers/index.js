import { actions } from '../actions';

const initialState = {
  room: null,
  players: []
} 

export default (state = initialState, action) => {
  const setState = newState => Object.assign({}, state, newState);
  switch (action.type) {
    case actions.SET_ROOM: 
      return setState({room: action.payload});
    case actions.SET_ACTIVE_PLAYERS: 
      return setState({players: action.payload});
    default:
      return state
  }
}