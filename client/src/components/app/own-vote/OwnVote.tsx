import './OwnVote.scss';
import React, {useEffect, useState} from 'react';
import {Votes} from "../../../logic/ObjectStore";
import {ChildParametersType, IGlobalState} from "../../../logic/RestaurantListTableLogic";

function OwnVote({ getGlobal, setGlobal }: ChildParametersType) {
    const title = `Szia ${getGlobal.vote.name}! Eddigi választásaid:`;

    return (
        <div className={'card'}>
            <header className={'upcoming-header'}>{title}</header>
            <ul>
                { getGlobal.vote.restaurants.map(r => <li key={r.name}>{r.name}</li>) }
            </ul>
        </div>
    );
}

export default OwnVote;
