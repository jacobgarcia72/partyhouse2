import { actions } from '../actions';
import { games } from '../config/games';

const initialState = {
  room: null,
  players: [],
  game: {}
} 

export default (state = initialState, action) => {
  const setState = newState => Object.assign({}, state, newState);
  switch (action.type) {
    case actions.SET_ROOM:
      const room = action.payload;
      const players = room && room.players ? Object.values(room.players).filter(player => player.active) : [];
      const game = games.find(game => game.url === room.url);
      return setState({room, players, game});
    default:
      return state
  }
}