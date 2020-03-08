
export enum PriceRange {
    Cheap = 0,
    Normal = 1,
    Expensive = 2,
}

export enum CardType {
    Cash = 0,
    DebitCard = 1,
    SzepCard = 2,
}

export enum AmountType {
    Small = 0,
    Medium = 1,
    Big = 2,
    Custom = 3,
}

export interface IRestaurantData {

    // basic
    name: string; // name of the restaurant
    /*comment: string; // some comment about it, for newcomers, maybe
    location: string; // gps coordinates
    logo: string; // url to a logo */

    // restaurant properties
    priceRange: PriceRange; // how expensive it is
    supportedCards: CardType; // supported cards. szép, bank, etc.
    /*distance: number; // distance from the work (derived data)
    serveSpeed: number; // how long (minutes) it is until we can eat
    portionSize: AmountType; // in case of menu, size of portions
    sharedLocation: boolean; // some places have shared location with other restaurants
                             // which means you can eat together */
}

export enum VoteType {
    HardNo = 0,
    DontCare = 1,
    Maybe = 2,
    Yes = 3,
}

// @ts-ignore
export function renderVote(vote: VoteType): string {
    // tslint:disable-next-line:forin
    for (const enumMember in VoteType) {
        const isValueProperty = parseInt(enumMember, 10) >= 0;
        if (!isValueProperty && (VoteType[enumMember] as unknown) === vote){
            return enumMember;
        }
    }
    // never reached
}

export interface IPreference extends IRestaurantData {
    type: VoteType;
}

export interface IVote {
    name: string;
    restaurants: IPreference[];
}
