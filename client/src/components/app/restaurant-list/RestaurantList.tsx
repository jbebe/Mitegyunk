import './RestaurantList.scss';
import React from "react";
import {IRestaurantData, VoteType} from "../../../shared/Types";
import {
    FilterOnColumn,
    IRestaurantFieldMeta,
    OrderByColumn, ChildParametersType,
} from "../../../logic/RestaurantListTableLogic";

function RestaurantList({ getGlobal, setGlobal }: ChildParametersType) {

    const orderByColumn = (meta: IRestaurantFieldMeta) => {
        OrderByColumn(meta, getGlobal, setGlobal);
    };

    const filterOnColumn = (e: React.ChangeEvent<HTMLSelectElement>, meta: IRestaurantFieldMeta) => {
        FilterOnColumn(
            Array.from(e.target.options)
                .filter((x) => x.selected)
                .map((x) => x.value),
            meta, getGlobal, setGlobal);
    };

    const updateVote = (restaurant: IRestaurantData) => {
        const vote = getGlobal.vote;

        if (!vote.restaurants.every(r => r.name !== restaurant.name)){
            return;
        }

        vote.restaurants.push({
            ...restaurant,
            type: VoteType.Yes,
        });

        getGlobal.voteApi.createAsync(vote)
        .then(() => {
            setGlobal((prev) => ({
                ...prev,
                vote: {
                    name: vote.name,
                    restaurants: vote.restaurants
                },
            }));
        });
    };

    const renderHeader = () =>
        getGlobal.fieldMetaData.map(h =>
            <div key={h.id} className={'list-column list-column-header'}>
                {h.text}
                <button onClick={() => orderByColumn(h)}>↕</button>
                <select onChange={(e) => filterOnColumn(e, h)} hidden={!h.filter} multiple>
                    { h.filter?.values.map(({key, value}) =>
                        <option key={`${h.id}${value}`} value={key}>{ value }</option>) }
                </select>
            </div>);

    const renderRestaurants = () =>
        getGlobal.restaurantsView
            .filter((r) => {
                const alreadyVotedRestaurants = getGlobal.vote.restaurants.map((x) => x.name);
                return !alreadyVotedRestaurants.includes(r.name);
            })
            .map((r, idx) =>
            <div key={r.name} className={'list-row'} onClick={() => updateVote(r)}>
                <div className={'list-column'}>{ renderColumn(r, 'name') }</div>
                <div className={'list-column'}>{ renderColumn(r, 'priceRange') }</div>
                <div className={'list-column'}>{ renderColumn(r, 'supportedCards') }</div>
            </div>);

    const renderColumn = (obj: IRestaurantData, prop: keyof IRestaurantData) => {
        const fieldMeta = getGlobal.fieldMetaData.find(f => f.id === prop);
        return fieldMeta!.renderValue(obj[prop]);
    };

    return (
        <div className={'card card-wide'}>
            <div className={'list-container'}>
                <div className={'list-row list-row-header'}>{ renderHeader() }</div>
                { renderRestaurants() }
            </div>
        </div>
    );
}

export default RestaurantList;
