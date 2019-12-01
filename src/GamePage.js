import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import pickBy from 'lodash/pickBy';
import sample from 'lodash/sample';
import { GoPencil, GoClippy, GoX } from "react-icons/go";
import database from './firebase';
import locations from './locations';
import Play from './Play';
import Footer from './Footer';

function GamePage({ createGame }) {
  const [game, setGame] = useState({});
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [copied, setCopied] = useState(false);

  const { gameId } = useParams();

  function activeUsers() {
    return game.users && pickBy(game.users, (user) => user.kicked !== true)
  }

  const history = useHistory();

  function handleCreateGame() {
    const newGameId = createGame()
    history.push(`/${newGameId}`)
  }

  function updateUsername() {
    database.ref(`games/${gameId}/users/${userId}`).update({
      username: username
    });
  }

  useEffect(() => {
    if (userId && game.users && game.users[userId].kicked === true) {
      localStorage.removeItem('userId');
      return
    }

    addUser()
  });


  useEffect(() => {
    database.ref(`games/${gameId}`).once('value', function(snapshot) {
      const gameData = snapshot.val()
      if (gameData) {
        setGame(gameData);
        localStorage.setItem('game', gameId)
      } else {
        localStorage.clearItem('game')
        history.push('/')
      }
    });
  }, [gameId]);

  useEffect(() => {
    database.ref(`games/${gameId}`).on('value', function(snapshot) {
      setGame(snapshot.val());
    });
  }, [JSON.stringify(game)]);

  function updateGameStatus() {
    if (game.status === 'waiting') {
      database.ref(`games/${gameId}`).update({
        status: 'playing',
        spy: sample(Object.keys(activeUsers())),
        location: sample(locations()),
      });
    } else if (game.status === 'playing') {
      database.ref(`games/${gameId}`).update({
        status: 'waiting'
      })
    }
  }

  function startGame() {
    database.ref(`games/${gameId}`).update({
      status: "playing"
    });
  }

  function handleDelete(uid) {
    database.ref(`games/${gameId}/users/${uid}`).update({ kicked: true });
  }

  function addUser() {
    const storedUserId = localStorage.getItem('userId')
    const userIdPersisted = !!(game.users && Object.keys(game.users).includes(storedUserId))

    if (game.status && (!storedUserId || !userIdPersisted)) {
      console.log("adding a user")
      let newUserId = Math.random().toString(36).substr(2, 5)
      const playerNumber = game.users ? Object.keys(game.users).length + 1 : 1
      const newUsername = `Player${playerNumber}`
      database.ref(`games/${gameId}/users/${newUserId}`).set({
        username: newUsername
      });
      localStorage.setItem('userId', newUserId)
      setUserId(newUserId)
      setUsername(newUsername)
    } else if (userIdPersisted && !username) {
      setUserId(storedUserId)
      setUsername(game.users[storedUserId].username)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 750)
  }

  if (!game.users) return('');

  return (
    game.status === 'waiting' ? (
      <div className="mt-5">
        <h2>Waiting for players...</h2>
        <div>
          <button
            className="btn btn-secondary mt-4 btn-copy"
            onClick={handleCopy}
            disabled={copied}
          >
            <span>{copied ? 'Copied!' : 'Copy game link'}</span>
            <GoClippy className="ml-3"/>
          </button>
        </div>
        <ul className="list-group player-list mt-5">
          {Object.keys(activeUsers()).map(uid =>
            <li className="list-group-item foo" key={uid}>
              { uid === userId ?
                <EditUsername setUsername={setUsername} username={username} updateUsername={updateUsername}/>
              :
                <div>
                  <span>{activeUsers()[uid].username}</span>
                  <button onClick={() => handleDelete(uid)}>
                    <GoX />
                  </button>
                </div>
              }
            </li>
          )}
        </ul>
        <form className="mt-5">
          {game.status === 'waiting' &&
            <button 
              className="btn btn-secondary mr-2"
              type="button"
              onClick={handleCreateGame}
            >
              Create new game
            </button>
          }
          <button
            className="btn btn-primary ml-2" type="button"
            onClick={updateGameStatus}
          >
            Start Game
          </button>
        </form>
        <Footer />
      </div>
    ) : (
      <Play quit={updateGameStatus} game={game} userId={userId} activeUsers={activeUsers}/>
    )
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
        class="form-control"
        placeholder={username} 
        onChange={(e) => setUsername(e.target.value)}
        onBlur={handleUpdateUsername}
        autoFocus
      />
    : <div>
        <span>{username}</span>
        <button className="btn btn-default" onClick={() => setEditingUsername(true)}>
          <GoPencil />
        </button>
      </div>
  )
}

export default GamePage;