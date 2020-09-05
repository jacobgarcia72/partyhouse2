import { actions } from '../actions';
import { games } from '../config/games';

const initialState = {
  code: null,
  players: [],
  game: {},
  gameState: null,
  playerIndex: null,
  isHost: null,
  input: null
} 

export default (state = initialState, action) => {
  const setState = newState => Object.assign({}, state, newState);
  switch (action.type) {
    case actions.SET_ROOM:
      const room = action.payload;
      if (room) {
        const players = room && room.players ? Object.values(room.players).filter(player => player.active) : [];
        const game = games.find(game => game.url === room.url);
        const { gameState, code, input } = room;
        return setState({ code, players, game, gameState, input });
      } else {
        return setState(initialState);
      }
    case actions.SET_PLAYER_INDEX:
      return setState({playerIndex: action.payload, isHost: action.payload === 0});
    default:
      return state
  }
}