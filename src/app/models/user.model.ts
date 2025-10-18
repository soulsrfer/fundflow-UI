export class UserModel {
    constructor(
        public SCOPE: string,
        public USERID: number,
        public sub: string,
        private _token: string,
        public iat: Date,
        public exp: Date
        ) {}

        get token() {
            if (!this.exp || new Date() > this.exp) {
                return null;
            }
            return this._token
        }

        get xpirationTime() {
            return this.exp;
          }
        
          get issuedAt() {
            return this.iat;
          }

}