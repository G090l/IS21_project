const Login = require('../../router/handlers/userHandlers/login.js');
const Logout = require('../../router/handlers/userHandlers/logout.js');
const Registration = require('../../router/handlers/userHandlers/registration.js');
const DeleteUser = require('../../router/handlers/userHandlers/deleteUser.js');
const GetUserInfo = require('../../router/handlers/userHandlers/getUserInfo.js');
const GetRatingTable = require('../../router/handlers/userHandlers/getRatingTable.js');

class UserManager {
    constructor(db) {
        this.db = db;
    }

    async login(params) {
        if (!params.login || !params.passwordHash) {
            return { error: 242 };
        }
        const handler = new Login(this.db);
        return await handler.execute(params);
    }

    async logout(params) {
        if (!params.token) {
            return { error: 242 };
        }
        const handler = new Logout(this.db);
        return await handler.execute(params);
    }

    async registration(params) {
        if (!params.login || !params.passwordHash || !params.nickname) {
            return { error: 242 };
        }
        const handler = new Registration(this.db);
        return await handler.execute(params);
    }

    async getUserInfo(params) {
        if (!params.token) {
            return { error: 242 };
        }
        const handler = new GetUserInfo(this.db);
        return await handler.execute(params);
    }

    async deleteUser(params) {
        if (!params.token) {
            return { error: 242 };
        }
        const handler = new DeleteUser(this.db);
        return await handler.execute(params);
    }

    async getRatingTable(params) {
        if (!params.token) {
            return { error: 242 };
        }
        const handler = new GetRatingTable(this.db);
        return await handler.execute(params);
    }
}

module.exports = UserManager;