import { database } from '../Firebase';
import { setRoom, setPlayerIndex, setPlayerNeedsToJoinRoom, setIsHost, setPlayCounts, setCurrentVideo, setCurrentMusic, setIsController } from '../actions';
import store from '../config/store';
import { getGameByUrl } from '../config/games';

import NotificatinService, {PLAYERS_CHANGED} from '../services/notif-service';

let ns = new NotificatinService();

class Player {
  constructor(name, index) {
    this.name = name;
    this.index = index;
    this.active = true;
  }
}

function setLocalStorage(playerIndex, roomCode) {
  localStorage.setItem('player-index', playerIndex);
  localStorage.setItem('room-code', roomCode);
}

export const isDevMode = () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const shuffle = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createNewRoom(gameUrl, roomCode, settings, isPartyMode, callback) {
  roomCode = roomCode.toLowerCase();
  const newRoom = {
    players: null,
    url: gameUrl,
    nextIndex: 0,
    code: roomCode,
    isPartyMode,
    gameState: {
      screen: 'lobby',
      settings
    },
    chat: []
  };
  if (isPartyMode) {
    store.dispatch(setIsController(true));
  }
  database.ref(`rooms/${roomCode}`).set(newRoom).then(() => callback(newRoom));
}

export function joinRoom(roomCode, name, callback) {
  roomCode = roomCode.toLowerCase();
  database.ref(`rooms/${roomCode}`).once('value', snapshot => {
    const room = snapshot.val();
    const roomExists = room !== null;
    const game = roomExists ? getGameByUrl(room.url) : null;
    if (room && !Array.isArray(room.players)) {
      room.players = room.players ? Object.values(room.players) : [];
    }
    const roomIsFull = roomExists && game && room.players.filter(player => player.active).length === game.maxPlayers;
    let playerIndex = null;
    if (roomExists && !roomIsFull) {
      playerIndex = room.nextIndex;
      const newPlayer = new Player(name, playerIndex);
      room.nextIndex++;
      room.players[playerIndex] = newPlayer;
      setLocalStorage(playerIndex, roomCode);
      store.dispatch(setPlayerIndex(playerIndex));
      setRoomListener(roomCode, playerIndex);
      if (playerIndex === 0) {
        store.dispatch(setIsHost(true));
        if (!room.isPartyMode) {
          store.dispatch(setIsController(true));
        }
      }
      database.ref(`rooms/${roomCode}`).update(room);
      database.ref(`rooms/${roomCode}/players/${playerIndex}/active`).onDisconnect().remove();
    }
    if (callback) callback(roomExists, roomIsFull, room);
  });     
};

export function rejoinRoom(roomCode, callback) {
  database.ref(`rooms/${roomCode}`).once('value', snapshot => {
    const room = snapshot.val();
    let success = false;
    const roomExists = room !== null;
    const game = roomExists ? getGameByUrl(room.url) : null;
    if (room && !Array.isArray(room.players)) {
      room.players = room.players ? Object.values(room.players) : [];
    }
    const roomIsFull = roomExists && game && room.players.filter(player => player.active).length === game.maxPlayers;
    if (roomExists && !roomIsFull) {
      let playerIndex = localStorage.getItem('player-index');
      const savedRoomCode = localStorage.getItem('room-code');
      success = true;
      if (savedRoomCode === roomCode && (playerIndex || playerIndex === 0) && room.players && room.players[playerIndex]) {
        if (room.players[playerIndex].banned) {
          success = false;
        } else {
          room.players[playerIndex].active = true;
          store.dispatch(setPlayerIndex(playerIndex));
          setRoomListener(roomCode, playerIndex);
          database.ref(`rooms/${roomCode}/players/${playerIndex}`).update({active: true, kicked: null});
          database.ref(`rooms/${roomCode}/players/${playerIndex}/active`).onDisconnect().remove();
        }
      } else {
        store.dispatch(setPlayerNeedsToJoinRoom(true));
      }
    }
    callback(success ? room : null);
  });    
};

export function removePlayerFromRoom(roomCode, playerIndex, banned = false) {
  database.ref(`rooms/${roomCode}`).once('value', snapshot => {
    const room = snapshot.val();
    if (room) {
      if (!room.players) {
        database.ref(`rooms/${roomCode}/`).remove();
      } else if (room.players[playerIndex]) {
        database.ref(`rooms/${roomCode}/players/${playerIndex}`).update({active: false, kicked: true, banned});
      }
    }
  });
};

export function setRoomListener(roomCode, playerIndex = null) { // null if it's the display
  database.ref(`rooms/${roomCode}`).on('value', snapshot => {
    const room = snapshot.val();
    store.dispatch(setRoom(room));
  });
  database.ref(`rooms/${roomCode}/players`).on('value', snapshot => {
    const players = snapshot.val();
    
    const prevPlayers = store.getState().players;
    const newPlayers = players ? players.filter(p => p.active && !p.kicked && !p.banned) : [];

    const playerIndices = players => players.map(player => player.index);
    if (newPlayers.length !== prevPlayers.length) {
      const playersJoined = playerIndices(newPlayers)
        .filter(index => !playerIndices(prevPlayers).includes(index));
      const playersGone = playerIndices(prevPlayers)
        .filter(index => !playerIndices(newPlayers).includes(index));
      const firstActivePlayer = playerIndices(players.filter(p => p.active).sort())[0];
      if (playerIndex !== null && (Number(firstActivePlayer) === Number(playerIndex))) {
        store.dispatch(setIsHost(true));
      }
      ns.postNotification(PLAYERS_CHANGED, { playersJoined, playersGone, newTotal: newPlayers.length, newPlayers });
    }
    if (playerIndex === null) return;
    const currentPlayer = players.find(p => Number(p.index) === Number(playerIndex));
    if (currentPlayer && currentPlayer.kicked) {
      if (currentPlayer.banned) localStorage.setItem('banned', roomCode);
      window.location.replace(window.location.origin);
    }
  });
};

export function setGameState(roomCode, gameState) {
  if (gameState) {
    database.ref(`rooms/${roomCode}/gameState`).update(gameState);
  } else {
    database.ref(`rooms/${roomCode}/`).remove();
  }
}

export function sendInput(roomCode, playerIndex, newInput) {
  database.ref(`rooms/${roomCode}`).once('value', snapshot => {
    const room = snapshot.val();
    if (!room) {
      return;
    }
    database.ref(`rooms/${roomCode}/input/${playerIndex}`).set(newInput);
  });
}

export function clearInput(roomCode) {
  database.ref(`rooms/${roomCode}`).once('value', snapshot => {
    const room = snapshot.val();
    if (!room) {
      return;
    }
    database.ref(`rooms/${roomCode}/input`).set(null);
  });
}

export function postChat(roomCode, playerIndex, message) {
  database.ref(`rooms/${roomCode}`).once('value', snapshot => {
    const room = snapshot.val();
    if (!room) return;
    const player = room.players.find(p => p.index === playerIndex);
    if (!player) return;
    database.ref(`rooms/${roomCode}/chat`).push({
      name: player.name,
      message
    });
  });
}

export function incrementGame(gameName) {
  if (isDevMode()) return;
  database.ref(`stats/play-counts/${gameName}`).once('value', snapshot => {
    let games = snapshot.val();
    if (!games) games = 0;
    games ++;
    database.ref(`stats/play-counts/${gameName}`).set(games);
  });
}

export function getPlayCounts() {
  database.ref(`stats/play-counts`).once('value', snapshot => {
    const stats = snapshot.val() || {};
    store.dispatch(setPlayCounts(stats));
  });
}

export function playVideo(video) {
  store.dispatch(setCurrentVideo(video));
}

export function playMusic(music) {
  store.dispatch(setCurrentMusic(music));
}

export function isNewInput(prevInput, newInput) {
  if (!newInput) return false;
  if (typeof prevInput !== typeof newInput) return true;
  if (prevInput?.length !== newInput?.length) return true;
  if (Array.isArray(prevInput) && Array.isArray(newInput)) return newInput.some((item, i) => this.isNewInput(item, prevInput[i]));
  return false;
}
