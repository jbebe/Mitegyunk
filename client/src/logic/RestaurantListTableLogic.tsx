import React from "react";
import {CardType, IRestaurantData, IVote, PriceRange} from "../shared/Types";
import {ApiStore} from "./ApiStore";

function getEnumNames<T extends number>(currentValue: number, enumValues: string[], initialValue?: T) {
    const values: T[] = initialValue !== undefined ? [initialValue] : [];
    const keys = enumValues;

    for (let i = 0; i < ((keys.length/2)|0); ++i){
        if (((+currentValue) & (1 << i)) !== 0){
            // @ts-ignore
            values.push(1 << i);
        }
    }

    return values.map(v => {
        // @ts-ignore
        const valueIndex = keys.findIndex(k => k === v.toString());
        return keys[valueIndex + (keys.length/2)];
    });
}

function getArrayOfEnum(keys: string[]){
    const values = [] as string[];
    const names = [] as string[];
    for (const type of keys){
        if (/^\d/g.test(type))
            values.push(type);
        else
            names.push(type);
    }
    return names.reduce(
        (acc, curr, idx) =>
            [...acc, { key: values[idx], value: names[idx] }],
        [] as Array<KeyValuePair>);
}

export function getCardTypeNames(val: CardType): string[] {
    return getEnumNames(val, Object.keys(CardType), CardType.Cash);
}

export interface KeyValuePair {
    key: string;
    value: string;
}

export interface IRestaurantFieldMeta {
    id: string;
    text: string;
    renderValue: (value: any) => string;
    orderBy: {
        callback: (a: IRestaurantData, b: IRestaurantData, descending: boolean) => number;
        isReversed: boolean;
    };
    filter: {
        values: KeyValuePair[];
        callback: (values: string[], data: IRestaurantData) => boolean
    } | null,
}

export interface IGlobalState {
    fieldMetaData: IRestaurantFieldMeta[];
    restaurantApi: ApiStore<IRestaurantData>;
    restaurants: IRestaurantData[];
    restaurantsView: IRestaurantData[]
    voteApi: ApiStore<IVote>;
    vote: IVote,
}

export type ChildParametersType = {
    getGlobal: IGlobalState,
    setGlobal: (value: (prevState: IGlobalState) => IGlobalState) => void
};

export const FieldMetadata = [
    {
        id: 'name',
        text: 'Név',
        renderValue: (value: any) => value,
        orderBy: {
            callback: (a: IRestaurantData, b: IRestaurantData, reversed: boolean) =>
                (a.name === b.name
                    ? 0
                    : ((a.name > b.name) as any) * 2 - 1)
                * (reversed ? -1 : 1),
            isReversed: false,
        },
        filter: null,
    },
    {
        id: 'priceRange',
        text: 'Ár',
        renderValue: (value: any) => '💲'.repeat((value as number) + 1),
        orderBy: {
            callback: (a: IRestaurantData, b: IRestaurantData, reversed: boolean) =>
                (a.priceRange - b.priceRange) * (reversed ? -1 : 1),
            isReversed: false,
        },
        filter: {
            values: getArrayOfEnum(Object.keys(PriceRange)),
            callback: (values, data) =>
                values.includes(data.priceRange.toString()),
        },
    },
    {
        id: 'supportedCards',
        text: 'Elfogad',
        renderValue: (value: CardType) => {
            const values = getCardTypeNames(value);
            return values.map(v =>
                <span key={v} className={v.toLowerCase()}/>
            )
        },
        orderBy: {
            callback: (a: IRestaurantData, b: IRestaurantData, reversed: boolean) =>
                (a.supportedCards - b.supportedCards) * (reversed ? -1 : 1),
            isReversed: false,
        },
        filter: {
            values: getArrayOfEnum(Object.keys(CardType)),
            callback: (values, data) => {
                const types = getArrayOfEnum(Object.keys(CardType));
                const options = values.map((x) =>
                    types.find((y) => y.key === x)!.value);
                const supportedCards = getCardTypeNames(data.supportedCards);
                return options.every((x) => supportedCards.includes(x));
            },
        },
    }
] as IRestaurantFieldMeta[];

export const OrderByColumn = (
    meta: IRestaurantFieldMeta,
    state: IGlobalState,
    setState: (value: (prevState: IGlobalState) => IGlobalState) => void) =>
{
    const ordered = [...state.restaurantsView];
    ordered.sort((a, b) =>
        meta.orderBy.callback(a, b, meta.orderBy.isReversed));

    setState((prev) => {
        const prevMeta = prev.fieldMetaData.find(m => m.id === meta.id)!;
        prevMeta.orderBy.isReversed = !meta.orderBy.isReversed;
        return {
            ...prev,
            restaurantsView: ordered,
            fieldMetaData: [
                ...prev.fieldMetaData
            ],
        };
    });
};

export const FilterOnColumn = (
    values: string[],
    meta: IRestaurantFieldMeta,
    state: IGlobalState,
    setState: (value: (prevState: IGlobalState) => IGlobalState) => void) =>
{
    const filtered = state.restaurants.filter(r => meta.filter!.callback(values, r));
    setState((prev) => ({
        ...prev,
        restaurantsView: filtered,
    }));
};
