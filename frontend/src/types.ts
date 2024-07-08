export interface IUserProfile {
    _id?: string;
    name: string;
    email: string;
    age?: number;
    tags?: string[];
}

export interface DataItem {
    id: number;
    value: string;
    number: number;
}
