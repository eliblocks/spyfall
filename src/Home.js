import React from 'react'

function Home(props) {
  return (
    <div class="container">
      <h4 className="mt-5">Welcome to Spyfall</h4>
      <button className="btn btn-primary mt-4" onClick={props.handleSubmit}>
        Create game
      </button>
    </div>
  );
}

export default Home;