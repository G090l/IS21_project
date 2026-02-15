const LoginHandler = require('../../router/handlers/userHandlers/loginHandler.js');
const LogoutHandler = require('../../router/handlers/userHandlers/logoutHandler.js');
const RegistrationHandler = require('../../router/handlers/userHandlers/registrationHandler.js');
const DeleteUserHandler = require('../../router/handlers/userHandlers/deleteUserHandler.js');
const GetUserInfoHandler = require('../../router/handlers/userHandlers/getUserInfoHandler.js');
const GetRatingTableHandler = require('../../router/handlers/userHandlers/getRatingTableHandler.js');

class UserManager {
    constructor(db) {
        this.db = db;
    }

    async login(params) {
        if (!params.login || !params.passwordHash) {
            return { error: 242 };
        }
        const handler = new LoginHandler(this.db);
        return await handler.execute(params);
    }

    async logout(params) {
        if (!params.token) {
            return { error: 242 };
        }
        const handler = new LogoutHandler(this.db);
        return await handler.execute(params);
    }

    async registration(params) {
        if (!params.login || !params.passwordHash || !params.nickname) {
            return { error: 242 };
        }
        const handler = new RegistrationHandler(this.db);
        return await handler.execute(params);
    }

    async getUserInfo(params) {
        if (!params.token) {
            return { error: 242 };
        }
        const handler = new GetUserInfoHandler(this.db);
        return await handler.execute(params);
    }

    async deleteUser(params) {
        if (!params.token) {
            return { error: 242 };
        }
        const handler = new DeleteUserHandler(this.db);
        return await handler.execute(params);
    }

    async getRatingTable(params) {
        if (!params.token) {
            return { error: 242 };
        }
        const handler = new GetRatingTableHandler(this.db);
        return await handler.execute(params);
    }
}

module.exports = UserManager;