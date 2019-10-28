import React, { useState, useEffect } from 'react';
import database from './firebase';

function GamePage(props) {
  const [game, setGame] = useState({});
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('')

  function updateUsername() {
    database.ref(`games/${props.gameId}/users/${userId}`).update({
      username: username
    });
  }

  useEffect(() => {
    console.log(username)
    addUser()
  });

  useEffect(() => {
    database.ref(`games/${props.gameId}`).once('value', function(snapshot) {
      setGame(snapshot.val());
    });
  }, [props.gameId]);

  useEffect(() => {
    database.ref(`games/${props.gameId}`).on('value', function(snapshot) {
      setGame(snapshot.val());
    });
  }, [JSON.stringify(game)]);

  function updateGameStatus() {
    if (game && game.status) {
      database.ref(`games/${props.gameId}`).update({
        status: game.status === "waiting" ? "playing" : "waiting"
      });
    }
  }

  function startGame() {
    database.ref(`games/${props.gameId}`).update({
      status: "playing"
    });
  }

  function addUser() {
    const storedUserId = localStorage.getItem('userId')
    const userIdPersisted = !!(game.users && Object.keys(game.users).includes(storedUserId))


    if (game.status &&(!storedUserId || !userIdPersisted)) {
      let userId = Math.random().toString(36).substr(2, 5)
      const playerNumber = game.users ? Object.keys(game.users).length + 1 : 1
      const username = `Player${playerNumber}`
      database.ref(`games/${props.gameId}/users/${userId}`).set({
        username: username
      });
      localStorage.setItem('userId', userId)
      setUserId(userId)
      setUsername(username)
    } else if (userIdPersisted && !username) {
      setUserId(storedUserId)
      setUsername(game.users[storedUserId].username)
    }
  }

  return (
    <div>
      <h2>Game: {props.gameId}</h2>
      <h4>Status: {game.status}</h4>
      <h4>User Id: {userId}</h4>
      <h4>Username: {username}</h4>
      <h4>Users:</h4>
      {game.users && (
        <ul style={{listStyle: 'none'}}>
          {Object.keys(game.users).map(uid =>
            <li key={uid}>
              { uid === userId ? 
                <EditUsername setUsername={setUsername} username={username} updateUsername={updateUsername}/> 
              : 
                game.users[uid].username 
              }
            </li>
          )}
        </ul>
      )}
      <form>
        <button type="button" onClick={props.handleSubmit}>
          Create new game
        </button>
        <button type="button" onClick={updateGameStatus}>
          {game.status === 'waiting' ? 'Start game' : 'Leave game'}
        </button>
      </form>
    </div>
  );
}

function EditUsername({username, setUsername, updateUsername}) {
  const [editingUsername, setEditingUsername] = useState(false);

  function handleUpdateUsername() {
    updateUsername()
    setEditingUsername(false)
  }

  return (
    editingUsername ? 
      <input 
        value={username} 
        onChange={(e) => setUsername(e.target.value)}
        onBlur={handleUpdateUsername}
      /> 
    : 
      <span onClick={() => setEditingUsername(true)}>{username} (edit)</span>
  )
}

export default GamePage;