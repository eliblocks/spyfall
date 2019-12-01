import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return(
    <div className="instructions mt-5">
      <div>
        <Link to="/instructions" >
          Instructions
        </Link>
      </div>
      <div>
        <a 
          href="https://www.amazon.com/Cryptozoic-Entertainment-CZE01904-Spyfall-Card/dp/B00Y4TYRT8/"
         >
          Buy physical game
        </a>
      </div>
    </div>
  );
}

export default Footer;