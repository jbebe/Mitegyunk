import './UpcomingLunch.scss';
import React from 'react';
import {IVoter, renderVote, VoteType} from "../../../types/Types";
import {ObjectStore} from "../../../logic/ObjectStore";

function UpcomingLunch() {

    const restaurants = ObjectStore.getRestaurants();
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

    return (
        <div className={'card'}>
            <header className={'upcoming-header'}>{title}</header>
            <div className={'voter-container'}>
                {
                    voters.map(v =>
                        <div key={v.name} className={'voter-row'}>
                            <div className={'voter-column'}>
                                {v.name}
                            </div>
                            <div className={'voter-column voter-column-restaurants'}>
                                {
                                    v.restaurants.map(r =>
                                        <div key={`${v.name}${r.name}${r.type}`}>
                                            {`${r.name} (${renderVote(r.type)})`}
                                        </div>)
                                }
                            </div>
                        </div>)
                }
            </div>
            <div className={'vote-result'}>{result}</div>
        </div>
    );
}

export default UpcomingLunch;
