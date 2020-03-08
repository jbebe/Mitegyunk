import React, {useEffect, useState} from 'react';
import './App.scss';
import RestaurantList from "./restaurant-list/RestaurantList";
import UpcomingLunch from "./upcoming-lunch/UpcomingLunch";
import Statistics from "./statistics/Statistics";
import OwnVote from './own-vote/OwnVote';
import {IPreference, IRestaurantData, IVote} from "../../shared/Types";
import {ApiStore} from "../../logic/ApiStore";
import {FieldMetadata, IGlobalState} from "../../logic/RestaurantListTableLogic";

function App() {
    const [state, setState] = useState({
        restaurants: [] as IRestaurantData[],
        restaurantsView: [] as IRestaurantData[],
        restaurantApi: ApiStore.getInstance<IRestaurantData>('restaurant'),
        vote: {
            name: (() => {
                let name = localStorage.name;
                if (!name){
                    do {
                        name = prompt('Mi a neved?');
                    } while (!/\w{3,}/g.test(name));
                    localStorage.name = name;
                }
                return name;
            })(),
            restaurants: [] as IPreference[],
        } as IVote,
        voteApi: ApiStore.getInstance<IVote>('vote'),
        fieldMetaData: FieldMetadata,
    } as IGlobalState);

    useEffect(() => {(async () => {
        const restaurants = await state.restaurantApi.getAllAsync();
        setState((prev) => ({
            ...prev,
            restaurants: restaurants,
            restaurantsView: restaurants,
        }));
    })()}, []);

    return (
        <div className="app">
            <OwnVote getGlobal={state} setGlobal={setState} />
            <UpcomingLunch />
            <RestaurantList getGlobal={state} setGlobal={setState} />
            <Statistics/>
        </div>
    );
}

export default App;
