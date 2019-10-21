import React, { useState, useEffect } from 'react';
import database from './firebase';

function GamePage(props) {
  const [game, setGame] = useState({})
  const [userId, setUserId] = useState('')

  useEffect(() => {
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

  function setGameStatus() {
    if (game && game.status) {
      database.ref(`games/${props.gameId}`).update({
        status: game.status === "Waiting" ? "In Play" : "Waiting"
      });
    }
  }

  function addUser() {
    const storedUserId = localStorage.getItem('userId')
    const userIdPersisted = !!(game.users && Object.keys(game.users).includes(storedUserId))

    if (game.status &&(!storedUserId || !userIdPersisted)) {
      let userId = Math.random().toString(36).substr(2, 5)

      database.ref(`games/${props.gameId}/users/${userId}`).set({
        foo: 'bar'
      });
      localStorage.setItem('userId', userId)
      setUserId(userId)
    } else if (userIdPersisted) {
      setUserId(storedUserId)
    }
  }

  return (
    <div>
      <h2>Game: {props.gameId}</h2>
      <h4>Status: {game.status}</h4>
      <h4>User Id: {userId}</h4>
      <h4>Users:</h4>
      {game.users && (
        <ul style={{listStyle: 'none'}}>
          {Object.keys(game.users).map(userId =>
            <li >{userId}</li>
          )}
        </ul>
      )}
      <form>
        <input type="button" value="Create New Game" onClick={props.handleSubmit} />
        <button type="button" onClick={setGameStatus}>Toggle game status</button>
      </form>
    </div>
  );
}

export default GamePage;