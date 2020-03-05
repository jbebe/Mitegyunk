import React, { useState } from "react";
import './RestaurantList.scss';
import {IRestaurantData} from "../../../shared/Types";
import {ObjectStore} from "../../../logic/ObjectStore";

interface IRestaurantFieldMeta {
    id: string;
    text: string;
    renderValue: (value: any) => string;
    orderBy: (a: any, b: any, descending: boolean) => number;
}

function RestaurantList() {
    const [restaurants, setRestaurants] = useState([] as IRestaurantData[]);

    async function initAsync(){
        const restaurants = await ObjectStore.getRestaurantsAsync();
        setRestaurants(restaurants);
    }

    initAsync();

    const header: IRestaurantFieldMeta[] = [
        {
            id: 'name',
            text: 'Név',
            renderValue: value => value,
            orderBy: (a, b) => a === b
                ? 0
                : ((a > b) as any) * 2 - 1,
        },
        {
            id: 'priceRange',
            text: 'Ár',
            renderValue: value => '💲'.repeat((value as number) + 1),
            orderBy: (a, b) => a - b,
        }
    ];
    const render = (obj: IRestaurantData, prop: keyof IRestaurantData) => {
        const fieldMeta = header.find(f => f.id === prop);
        return fieldMeta!.renderValue(obj[prop]);
    };

    return (
        <div className={'card'}>
            <div className={'list-container'}>
                <div className={'list-row list-row-header'}>
                    {
                        header.map(h => <div key={h.id} className={'list-column list-column-header'}>{h.text}</div>)
                    }
                </div>
                {
                    restaurants.map((r, idx) =>
                        <div key={r.name} className={'list-row'}>
                            <div className={'list-column'}>{render(r, 'name')}</div>
                            <div className={'list-column'}>{render(r, 'priceRange')}</div>
                        </div>)
                }
            </div>
        </div>
    );
}

export default RestaurantList;
