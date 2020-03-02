import {IRestaurantData, PriceRange} from "../types/Types";

export class ObjectStore {

    public static getRestaurants(): IRestaurantData[] {
        const restaurants: IRestaurantData[] = [
            {
                name: 'Black Cab Burger',
                priceRange: PriceRange.Cheap,
            },
            {
                name: 'Burger King Fővám tér',
                priceRange: PriceRange.Expensive,
            },
        ];
        return restaurants;
    }
}
