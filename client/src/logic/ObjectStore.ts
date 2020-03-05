import {IRestaurantData} from "../shared/Types";

export class ObjectStore {

    public static async getRestaurantsAsync(): Promise<IRestaurantData[]> {
        const response = await fetch('http://localhost:4000/api/restaurant');
        const restaurants = await response.json();
        return restaurants;
    }
}
