import './UpcomingLunch.scss';
import React, {useState} from 'react';
import {IRestaurantData, IVoter, renderVote, VoteType} from "../../../types/Types";
import {ObjectStore} from "../../../logic/ObjectStore";

function UpcomingLunch() {

    const [restaurants, setRestaurants] = useState([] as IRestaurantData[]);

    async function initAsync(){
        const restaurants = await ObjectStore.getRestaurantsAsync();
        setRestaurants(restaurants);
    }

    initAsync();

    const title = 'Állás';
    const voters: IVoter[] = [
        {
            name: 'Bálint',
            restaurants: [
                {
                    type:VoteType.Yes,
                    ...restaurants[Math.floor(Math.random()*restaurants.length)]
                },
                {
                    type:VoteType.Maybe,
                    ...restaurants[Math.floor(Math.random()*restaurants.length)]
                }
            ]
        },
        {
            name: 'Roland',
            restaurants: [
                {
                    type:VoteType.Yes,
                    ...restaurants[Math.floor(Math.random()*restaurants.length)]
                },
                {
                    type:VoteType.Maybe,
                    ...restaurants[Math.floor(Math.random()*restaurants.length)]
                }
            ]
        }
    ];
    const result = (() => {
        function intersection(sets: Array<Array<string>>): string[] {
            const [head, ...rest] = sets;
            if (rest.length === 0)
                return head;

            const set = new Set(head);
            // @ts-ignore
            return [...new Set(intersection(rest).filter(n => set.has(n)))];
        }

        const preferred = voters.map(v => v.restaurants.map(r => r.name));
        const mutualPreferred = intersection(preferred);

        return mutualPreferred.length !== 0
            ? mutualPreferred.length === 1
                ? `Irány a ${mutualPreferred[0]}!`
                : `Ezek jöhetnek szóba: ${mutualPreferred.join(', ')}`
            : 'Nincs közös egyezés :(';
    })();

    function renderRestaurants(voter: IVoter) {
        return voter.restaurants.map(r =>
            <div key={`${voter.name}${r.name}${r.type}`}>
                {`${r.name} (${renderVote(r.type)})`}
            </div>);
    }

    function renderVoters() {
        return voters.map(v =>
            <div key={v.name} className={'voter-row'}>
                <div className={'voter-column'}>{v.name}</div>
                <div className={'voter-column voter-column-restaurants'}>{ renderRestaurants(v) }</div>
            </div>);
    }

    return (
        <div className={'card'}>
            <header className={'upcoming-header'}>{title}</header>
            <div className={'voter-container'}>{ renderVoters() }</div>
            <div className={'vote-result'}>{result}</div>
        </div>
    );
}

export default UpcomingLunch;
