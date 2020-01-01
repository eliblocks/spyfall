import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';

function Home({ createGame }) {
  const history = useHistory()

  useEffect(() => {
    let storedGameId = localStorage.getItem('game')
    if (storedGameId) {
      history.push(`/${storedGameId}`)
    }
  });

  function handleSubmit() {
    const newGameId = createGame()
    history.push(`/${newGameId}`)
  }

  return (
    <div className="container">
      <h4 className="mt-5">Welcome to Spyfall</h4>
      <button className="btn btn-primary mt-4" onClick={handleSubmit}>
        Create game
      </button>
    </div>
  );
}

export default Home;