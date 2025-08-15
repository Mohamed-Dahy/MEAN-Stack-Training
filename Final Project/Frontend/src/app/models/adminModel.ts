export class AdminModel{
      constructor(
        public email : string,
        public _id : string ,
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
