import './UpcomingLunch.scss';
import React, {useState} from 'react';
import {IVote, renderVote} from "../../../shared/Types";
import {ChildParametersType} from "../../../logic/RestaurantListTableLogic";

function UpcomingLunch({ getGlobal, setGlobal }: ChildParametersType) {
    const [voters, setVoters] = useState([]  as IVote[]);

    getGlobal.voteApi.getAllAsync().then((val) => {
       setVoters(val);
    });

    const title = 'Állás';

    const result = (() => {
        function intersection(sets: Array<Array<string>>): string[] {
            const [head, ...rest] = sets;
            if (rest.length === 0)
                return head || [];

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

    function renderRestaurants(voter: IVote) {
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
