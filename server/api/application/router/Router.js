const BaseManager = require('./BaseManager.js');
const DB = require('./db/DB.js');
const Login = require('./handlers/userHandlers/login.js');
const Logout = require('./handlers/userHandlers/logout.js');
const Registration = require('./handlers/userHandlers/registration.js');
const DeleteUser = require('./handlers/userHandlers/deleteUser.js');
const GetUserInfo = require('./handlers/userHandlers/getUserInfo.js');
const GetRatingTable = require('./handlers/userHandlers/getRatingTable.js');
const BuyItem = require('./handlers/itemHandlers/buyItem.js');
const SellItem = require('./handlers/itemHandlers/sellItem.js');
const UseArrow = require('./handlers/itemHandlers/useArrow.js');
const UsePotion = require('./handlers/itemHandlers/usePotion.js');
const GetItemsData = require('./handlers/itemHandlers/getItemsData.js');

class Router extends BaseManager {
    constructor() {
        const db = new DB();
        super(db);
    }

    // ============ USER METHODS ============
    async login(params) {
        if (params.login && params.passwordHash) {
            const handler = new Login(this.db);
            return await handler.execute(params);
        }
        return { error: 242 };
    }

    async logout(params) {
        if (params.token) {
            const user = await this.db.getUserByToken(params.token);
            if (user) {
                const handler = new Logout(this.db);
                return await handler.execute(params);
            }
            return { error: 705 };
        }
        return { error: 242 };
    }

    async registration(params) {
        if (params.login && params.passwordHash && params.nickname) {
            const handler = new Registration(this.db);
            return await handler.execute(params);
        }
        return { error: 242 };
    }

    async getUserInfo(params) {
        if (params.token) {
            const user = await this.db.getUserByToken(params.token);
            if (user) {
                const handler = new GetUserInfo(this.db);
                return await handler.execute(params);
            }
            return { error: 705 };
        }
        return { error: 242 };
    }

    async deleteUser(params) {
        if (params.token) {
            const user = await this.db.getUserByToken(params.token);
            if (user) {
                const handler = new DeleteUser(this.db);
                return await handler.execute(params);
            }
            return { error: 705 };
        }
        return { error: 242 };
    }

    async getRatingTable(params) {
        if (params.token) {
            const user = await this.db.getUserByToken(params.token);
            if (user) {
                const handler = new GetRatingTable(this.db);
                return await handler.execute(params);
            }
            return { error: 705 };
        }
        return { error: 242 };
    }

    // ============ ITEM METHODS ============
    async buyItem(params) {
        if (params.token && params.itemId) {
            const user = await this.db.getUserByToken(params.token);
            if (user) {
                const handler = new BuyItem(this.db);
                params.userId = user.id;
                return await handler.execute(params);
            }
            return { error: 705 };
        }
        return { error: 242 };
    }

    async sellItem(params) {
        if (params.token && params.itemId) {
            const user = await this.db.getUserByToken(params.token);
            if (user) {
                const handler = new SellItem(this.db);
                params.userId = user.id;
                return await handler.execute(params);
            }
            return { error: 705 };
        }
        return { error: 242 };
    }

    async useArrow(params) {
        if (params.token) {
            const user = await this.db.getUserByToken(params.token);
            if (user) {
                const handler = new UseArrow(this.db);
                params.userId = user.id;
                return await handler.execute(params);
            }
            return { error: 705 };
        }
        return { error: 242 };
    }

    async usePotion(params) {
        if (params.token) {
            const user = await this.db.getUserByToken(params.token);
            if (user) {
                const handler = new UsePotion(this.db);
                params.userId = user.id;
                return await handler.execute(params);
            }
            return { error: 705 };
        }
        return { error: 242 };
    }

    async getItemsData(params) {
        if (params.token) {
            const user = await this.db.getUserByToken(params.token);
            if (user) {
                const handler = new GetItemsData(this.db);
                return await handler.execute();
            }
            return { error: 705 };
        }
        return { error: 242 };
    }
}

module.exports = Router;