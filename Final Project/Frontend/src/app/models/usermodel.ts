export class Usermodel{
    constructor(
        public email : string,
        public password : string ,
        private _token : string,
        private expiresIn :Date
     ){}

     get token(): string | null{
    if(!this.expiresIn || this.expiresIn < new Date()){
       return null;
    }
    return this._token
}

}