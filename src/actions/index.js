export const actions = {
  SET_ROOM: 'SET_ROOM',
  SET_PLAYER_INDEX: 'SET_PLAYER_INDEX'
}

export function setRoom(room) {
  return { type: actions.SET_ROOM, payload: room };
}

export function setPlayerIndex(index) {
  return { type: actions.SET_PLAYER_INDEX, payload: Number(index) };
}
