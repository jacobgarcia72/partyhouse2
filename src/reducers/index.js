import { actions } from '../actions';
import { games } from '../config/games';

const initialState = {
  room: null,
  players: [],
  game: {},
  playerIndex: null,
  isHost: null
} 

export default (state = initialState, action) => {
  const setState = newState => Object.assign({}, state, newState);
  switch (action.type) {
    case actions.SET_ROOM:
      const room = action.payload;
      if (room) {
        const players = room && room.players ? Object.values(room.players).filter(player => player.active) : [];
        const game = games.find(game => game.url === room.url);
        return setState({room, players, game});
      } else {
        return setState(initialState);
      }
    case actions.SET_PLAYER_INDEX:
      return setState({playerIndex: action.payload, isHost: action.payload === 0});
    default:
      return state
  }
}