import React from 'react'

function Home(props) {
  return (
    <form>
      <input type="button" value="Create Game" onClick={props.handleSubmit} />
    </form>
  );
}

export default Home;