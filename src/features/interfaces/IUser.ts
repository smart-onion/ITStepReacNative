export default interface IUser {
    token: string,
    name: string,
    email: string,
    phone: string,
    currency?: string|null
};