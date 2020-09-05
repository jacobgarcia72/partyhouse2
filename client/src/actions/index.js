export const actions = {
  SET_ROOM: 'SET_ROOM',
  SET_PLAYER_INDEX: 'SET_PLAYER_INDEX',
  SET_PLAYER_NEEDS_TO_JOIN_ROOM: 'SET_PLAYER_NEEDS_TO_JOIN_ROOM'
}

export function setRoom(room) {
  return { type: actions.SET_ROOM, payload: room };
}

export function setPlayerIndex(index) {
  return { type: actions.SET_PLAYER_INDEX, payload: Number(index) };
}

export function setPlayerNeedsToJoinRoom(playerNeedsToJoinRoom) {
  return { type: actions.SET_PLAYER_NEEDS_TO_JOIN_ROOM, payload: Boolean(playerNeedsToJoinRoom) };
}

