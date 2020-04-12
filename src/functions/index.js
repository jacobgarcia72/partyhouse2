import { database } from '../Firebase';
import { games } from '../config/games';

export function createNewRoom(gameUrl, roomCode, playerName, callback) {
  roomCode = roomCode.toLowerCase();
  const game = games.find(game => game.url === gameUrl);
  const { minPlayers, maxPlayers } = game;
  const newRoom = {
    players: { 0: { name: playerName, playerIndex: 0 } },
    game: { minPlayers, maxPlayers, url: gameUrl },
    totalPlayers: 1,
    nextIndex: 1
  };
  database.ref(`rooms/${roomCode}`).set(newRoom).then(() => callback(newRoom));
  database.ref(`rooms/${roomCode}`).onDisconnect().remove();
}

export function joinRoom(roomCode, name, callback) {
  roomCode = roomCode.toLowerCase();
  database.ref(`rooms/${roomCode}`).once('value', snapshot => {
    const room = snapshot.val();
    const roomExists = room !== null;
    const roomIsFull = roomExists && room.totalPlayers === room.game.maxPlayers;
    let playerIndex = null;
    if (roomExists && !roomIsFull) {
      playerIndex = room.nextIndex;
      const newPlayer = {name, index: playerIndex};
      room.nextIndex++;
      room.totalPlayers++;
      room.players[playerIndex] = newPlayer;
      database.ref(`rooms/${roomCode}`).update(room);
    }
    callback(roomExists, roomIsFull, room);
  });     
};

