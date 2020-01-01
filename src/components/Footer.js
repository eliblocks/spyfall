import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return(
    <div className="instructions mt-5">
      <div>
        <a href="https://www.cryptozoic.com/sites/default/files/icme/u30695/spy_rules_eng_0.pdf">Instructions</a>
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