export const actions = {
  SET_ROOM: 'SET_ROOM',
  SET_ACTIVE_PLAYERS: 'SET_ACTIVE_PLAYERS'
}

export function setRoom(room) {
  return { type: actions.SET_ROOM, payload: room };
}

export function setActivePlayers(players) {
  return { type: actions.SET_ACTIVE_PLAYERS, payload: players };
}
