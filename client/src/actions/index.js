export const actions = {
  SET_ROOM: 'SET_ROOM',
  SET_PLAYER_INDEX: 'SET_PLAYER_INDEX',
  SET_PLAYER_NEEDS_TO_JOIN_ROOM: 'SET_PLAYER_NEEDS_TO_JOIN_ROOM',
  SET_IS_DISPLAY: 'SET_IS_DISPLAY',
  SET_IS_HOST: 'SET_IS_HOST',
  SET_IS_CONTROLLER: 'SET_IS_CONTROLLER',
  SET_PLAY_COUNTS: 'SET_PLAY_COUNTS',
  SET_CURRENT_MUSIC: 'SET_CURRENT_MUSIC',
  SET_CURRENT_VIDEO: 'SET_CURRENT_VIDEO'
}

export function setRoom(room) {
  return { type: actions.SET_ROOM, payload: room };
}

export function setIsDisplay() {
  return { type: actions.SET_IS_DISPLAY };
}

export function setPlayerIndex(index) {
  return { type: actions.SET_PLAYER_INDEX, payload: Number(index) };
}

export function setPlayerNeedsToJoinRoom(playerNeedsToJoinRoom) {
  return { type: actions.SET_PLAYER_NEEDS_TO_JOIN_ROOM, payload: Boolean(playerNeedsToJoinRoom) };
}

export function setIsHost(isHost) {
  return { type: actions.SET_IS_HOST, payload: Boolean(isHost) };
}

export function setIsController(isController) {
  return { type: actions.SET_IS_CONTROLLER, payload: Boolean(isController) };
}

export function setPlayCounts(playCounts) {
  return { type: actions.SET_PLAY_COUNTS, payload: playCounts };
}

export function setCurrentVideo(video) {
  return { type: actions.SET_CURRENT_VIDEO, payload: video };
}

export function setCurrentMusic(music) {
  return { type: actions.SET_CURRENT_MUSIC, payload: music };
}

