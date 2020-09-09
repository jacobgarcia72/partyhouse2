import { database } from '../Firebase';
import { setRoom, setPlayerIndex, setPlayerNeedsToJoinRoom, setIsHost } from '../actions';
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

export function createNewRoom(gameUrl, roomCode, playerName, callback) {
  roomCode = roomCode.toLowerCase();
  const newRoom = {
    players: { 0: new Player(playerName, 0) },
    url: gameUrl,
    nextIndex: 1,
    code: roomCode,
    gameState: {
      screen: 'lobby'
    }
  };
  setLocalStorage(0, roomCode);
  store.dispatch(setPlayerIndex(0));
  setRoomListener(roomCode, 0);
  database.ref(`rooms/${roomCode}`).set(newRoom).then(() => callback(newRoom));
  database.ref(`rooms/${roomCode}/players/${0}/active`).onDisconnect().remove();
}

export function joinRoom(roomCode, name, callback) {
  roomCode = roomCode.toLowerCase();
  database.ref(`rooms/${roomCode}`).once('value', snapshot => {
    const room = snapshot.val();
    const roomExists = room !== null;
    const game = roomExists ? getGameByUrl(room.url) : null;
    const roomIsFull = roomExists && game && room.players.filter(player => player.active).length === game.maxPlayers;
    let playerIndex = null;
    if (roomExists && !roomIsFull) {
      playerIndex = room.nextIndex;
      const newPlayer = new Player(name, playerIndex);
      room.nextIndex++;
      room.players[playerIndex] = newPlayer;
      setLocalStorage(playerIndex, roomCode);
      store.dispatch(setPlayerIndex(playerIndex));
      setRoomListener(roomCode, playerIndex)
      database.ref(`rooms/${roomCode}`).update(room);
      database.ref(`rooms/${roomCode}/players/${playerIndex}/active`).onDisconnect().remove();
    }
    callback(roomExists, roomIsFull, room);
  });     
};

export function rejoinRoom(roomCode, callback) {
  database.ref(`rooms/${roomCode}`).once('value', snapshot => {
    const room = snapshot.val();
    let success = false;
    const roomExists = room !== null;
    const game = roomExists ? getGameByUrl(room.url) : null;
    const roomIsFull = roomExists && game && room.players.filter(player => player.active).length === game.maxPlayers;
    if (roomExists && !roomIsFull) {
      let playerIndex = localStorage.getItem('player-index');
      const savedRoomCode = localStorage.getItem('room-code');
      success = true;
      if (savedRoomCode === roomCode && (playerIndex || playerIndex === 0) && room.players[playerIndex]) {
        room.players[playerIndex].active = true;
        store.dispatch(setPlayerIndex(playerIndex));
        setRoomListener(roomCode, playerIndex);
        database.ref(`rooms/${roomCode}/players/${playerIndex}`).update({active: true});
        database.ref(`rooms/${roomCode}/players/${playerIndex}/active`).onDisconnect().remove();
      } else {
        store.dispatch(setPlayerNeedsToJoinRoom(true));
      }
    }
    callback(success ? room : null);
  });    
};

function setRoomListener(roomCode, playerIndex) {
  database.ref(`rooms/${roomCode}/players`).on('value', snapshot => {
    const players = snapshot.val();
    
    const prevPlayers = store.getState().players;
    const newPlayers = players ? players.filter(p => p.active) : [];
    if (!newPlayers.length) {
      database.ref(`rooms/${roomCode}/`).remove();
      return;
    }
    const playerIndices = players => players.map(player => player.index);
    if (newPlayers.length !== prevPlayers.length) {
      const playersJoined = playerIndices(newPlayers)
        .filter(index => !playerIndices(prevPlayers).includes(index));
      const playersGone = playerIndices(prevPlayers)
        .filter(index => !playerIndices(newPlayers).includes(index));
      const firstActivePlayer = playerIndices(players.filter(p => p.active).sort())[0];
      if (Number(firstActivePlayer) === Number(playerIndex)) {
        store.dispatch(setIsHost(true));
      }
      ns.postNotification(PLAYERS_CHANGED, { playersJoined, playersGone, newTotal: newPlayers.length, newPlayers });
    }
  });
  database.ref(`rooms/${roomCode}`).on('value', snapshot => {
    const room = snapshot.val();
    store.dispatch(setRoom(room));
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
    const input = room.input || {};
    input[playerIndex] = newInput;
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
