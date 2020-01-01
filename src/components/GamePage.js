import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import sample from 'lodash/sample';
import { GoClippy } from "react-icons/go";
import database from '../firebase';
import LOCATIONS from '../locations';
import Play from './Play';
import Footer from './Footer';
import EditUsername from './EditUsername';

function GamePage({ createGame }) {
  const [game, setGame] = useState({});
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [copied, setCopied] = useState(false);  

  const { gameId } = useParams();
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
    addUser()
  });

  useEffect(() => {
    database.ref(`games/${gameId}`).once('value', function(snapshot) {
      const gameData = snapshot.val()
      if (gameData) {
        setGame(gameData);
        localStorage.setItem('game', gameId)
      } else {
        localStorage.removeItem('game')
        history.push('/')
      }
    });
  }, [gameId, history]);

  useEffect(() => {
    database.ref(`games/${gameId}`).on('value', function(snapshot) {
      setGame(snapshot.val());
    });
  }, [gameId]);

  function updateGameStatus() {
    if (game.status === 'waiting') {
      database.ref(`games/${gameId}`).update({
        status: 'playing',
        spy: sample(Object.keys(game.users)),
        location: sample(LOCATIONS),
      });
    } else if (game.status === 'playing') {
      database.ref(`games/${gameId}`).update({
        status: 'waiting'
      })
    }
  }

  function addUser() {
    const storedUserId = localStorage.getItem('userId')
    const userIdPersisted = !!(game.users && Object.keys(game.users).includes(storedUserId))

    if (game.status && (!storedUserId || !userIdPersisted)) {
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
          {Object.keys(game.users).map(uid =>
            <li className="list-group-item foo" key={uid}>
              { uid === userId ?
                <EditUsername setUsername={setUsername} username={username} updateUsername={updateUsername}/>
              :
                <div>
                  <span>{game.users[uid].username}</span>
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
      <Play quit={updateGameStatus} game={game} userId={userId} />
    )
  );
}

export default GamePage;