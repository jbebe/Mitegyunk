import './OwnVote.scss';
import React from 'react';
import {ChildParametersType} from "../../../logic/RestaurantListTableLogic";
import {IPreference} from "../../../shared/Types";

function OwnVote({ getGlobal, setGlobal }: ChildParametersType) {
    const title = `Szia ${getGlobal.vote.name}! Eddigi választásaid:`;

    const deleteVote = (preference: IPreference) => {
        const vote = {
            ...getGlobal.vote,
            restaurants: getGlobal.vote.restaurants
                .filter((p) => p.name !== preference.name)
        };
        getGlobal.voteApi.createAsync(vote).then(() => {
            setGlobal((prev) => ({
                ...prev,
                vote: vote,
            }));
        });
    };

    return (
        <div className={'card'}>
            <header className={'upcoming-header'}>{title}</header>
            <ul>
                { getGlobal.vote.restaurants.map((r) =>
                    <li key={r.name}>
                        {r.name}
                        <button onClick={ () => deleteVote(r) }>❌</button>
                    </li>
                ) }
            </ul>
        </div>
    );
}

export default OwnVote;
