import { actions } from '../actions';
import { games } from '../config/games';

const initialState = {
  code: null,
  players: [],
  game: {},
  gameState: null,
  playerIndex: null,
  isHost: null,
  input: null,
  chat: [],
  playCounts: {}
} 

export default (state = initialState, action) => {
  const setState = newState => Object.assign({}, state, newState);
  switch (action.type) {
    case actions.SET_ROOM:
      const room = action.payload;
      if (room) {
        const players = room && room.players ? Object.values(room.players).filter(player => player.active) : [];
        const chat = room && room.chat ? Object.values(room.chat) : [];
        const game = games.find(game => game.url === room.url);
        const { gameState, code, input } = room;
        return setState({ code, players, game, gameState, input, chat });
      } else {
        return setState(initialState);
      }
    case actions.SET_PLAYER_INDEX:
      return setState({playerIndex: action.payload, isHost: action.payload === 0});
    case actions.SET_PLAYER_NEEDS_TO_JOIN_ROOM:
      return setState({playerNeedsToJoinRoom: action.payload});
    case actions.SET_IS_HOST:
      return setState({isHost: action.payload});
    case actions.SET_PLAY_COUNTS:
      return setState({playCounts: action.payload});
    default:
      return state
  }
}