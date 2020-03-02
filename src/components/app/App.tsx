import React from 'react';
import './App.scss';
import RestaurantList from "./restaurant-list/RestaurantList";
import UpcomingLunch from "./upcoming-lunch/UpcomingLunch";
import Statistics from "./statistics/Statistics";

function App() {
  return (
    <div className="app">
        <UpcomingLunch />
        <RestaurantList />
        <Statistics/>
    </div>
  );
}

export default App;
