import {IRestaurantData} from "../types/Types";

export class ObjectStore {

    public static async getRestaurantsAsync(): Promise<IRestaurantData[]> {
        const response = await fetch('http://localhost:4000/api/restaurant');
        const restaurants = await response.json();
        /*const restaurants: IRestaurantData[] = [
            {
                name: 'Black Cab Burger',
                priceRange: PriceRange.Cheap,
            },
            {
                name: 'Burger King Fővám tér',
                priceRange: PriceRange.Expensive,
            },
        ];*/
        return restaurants;
    }
}
