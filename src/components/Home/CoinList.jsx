import * as React from 'react';
import CoinCard from './CoinCard.jsx';
import './Home.css';

export default function CoinList({ coinList, viewMode, isDarkMode }) {
  return (
    <div className="gainersAndLosers">
      {coinList.map((coin) => {
        return <CoinCard key={crypto.randomUUID()} coin={coin} viewMode={viewMode} isDarkMode={isDarkMode} />;
      })}
    </div>
  );
}
