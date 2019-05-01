export class User {
    photo: string;
    constructor(
        public userId: string,
        public firstname: string,
        public lastname: string,
        public email: string,
        public phone: string,
        public birth: string,
        public sex: string) {}
}