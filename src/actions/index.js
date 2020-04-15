export const actions = {
  SET_ROOM: 'SET_ROOM',
}

export function setRoom(room) {
  return { type: actions.SET_ROOM, payload: room };
}
