import { database } from '../Firebase';
import { games } from '../config/games';

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

export function createNewRoom(gameUrl, roomCode, playerName, callback) {
  roomCode = roomCode.toLowerCase();
  const game = games.find(game => game.url === gameUrl);
  const { minPlayers, maxPlayers } = game;
  const newRoom = {
    players: { 0: new Player(playerName, 0) },
    game: { minPlayers, maxPlayers, url: gameUrl },
    nextIndex: 1
  };
  setLocalStorage(0, roomCode);
  database.ref(`rooms/${roomCode}`).set(newRoom).then(() => callback(newRoom));
  database.ref(`rooms/${roomCode}`).onDisconnect().remove();
}

export function joinRoom(roomCode, name, callback) {
  roomCode = roomCode.toLowerCase();
  database.ref(`rooms/${roomCode}`).once('value', snapshot => {
    const room = snapshot.val();
    const roomExists = room !== null;
    const roomIsFull = roomExists && room.players.filter(player => player.active).length === room.game.maxPlayers;
    let playerIndex = null;
    if (roomExists && !roomIsFull) {
      playerIndex = room.nextIndex;
      const newPlayer = new Player(name, playerIndex);
      room.nextIndex++;
      room.players[playerIndex] = newPlayer;
      setLocalStorage(playerIndex, roomCode);
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
    const roomIsFull = roomExists && room.players.filter(player => player.active).length === room.game.maxPlayers;
    let playerIndex = localStorage.getItem('player-index');
    if (roomExists && !roomIsFull && (playerIndex || playerIndex === 0) && room.players[playerIndex]) {
      success = true;
      room.players[playerIndex].active = true;
      database.ref(`rooms/${roomCode}/players/${playerIndex}`).update({active: true});
      database.ref(`rooms/${roomCode}/players/${playerIndex}/active`).onDisconnect().remove();
    }
    callback(success ? room : null);
  });    
}
