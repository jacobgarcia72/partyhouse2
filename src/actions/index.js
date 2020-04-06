import { database } from '../Firebase';
import { games } from '../config/games';

export function createNewRoom(gameUrl, roomCode) {
  roomCode = roomCode.toLowerCase();
  const game = games.find(game => game.url === gameUrl);
  const { minPlayers, maxPlayers } = game;
  database.ref(`rooms/${roomCode}`).set({
    players: [], game: { minPlayers, maxPlayers }, totalPlayers: 0, nextIndex: 0
  });
  database.ref(`rooms/${roomCode}`).onDisconnect().remove();
}

export function joinRoom(roomCode, name, callback) {
  roomCode = roomCode.toLowerCase();
  database.ref(`rooms/${roomCode}`).once('value', snapshot => {
    let room = snapshot.val();
    const roomExists = room !== null;
    const roomIsFull = roomExists && room.totalPlayers === room.game.maxPlayers;
    let playerIndex = null;
    if (roomExists && !roomIsFull) {
      playerIndex = room.nextIndex;
      const newPlayer = {name, index: playerIndex};
      const nextIndex = room.nextIndex + 1;
      const totalPlayers = room.totalPlayers + 1;
      database.ref(`rooms/${roomCode}`).update({
         totalPlayers, nextIndex
      });
      database.ref(`rooms/${roomCode}/players/${playerIndex}`).set(newPlayer);
    }
    callback(roomExists, roomIsFull, playerIndex);
  });     
};

