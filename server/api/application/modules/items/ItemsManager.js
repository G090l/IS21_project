const BuyItem = require('../../router/handlers/itemHandlers/buyItem.js');
const SellItem = require('../../router/handlers/itemHandlers/sellItem.js');
const UseArrow = require('../../router/handlers/itemHandlers/useArrow.js');
const UsePotion = require('../../router/handlers/itemHandlers/usePotion.js');
const GetItemsData = require('../../router/handlers/itemHandlers/getItemsData.js');

class ItemsManager {
    constructor(db) {
        this.db = db;
    }

    async buyItem(params) {
        if (!params.token || !params.itemId) {
            return { error: 242 };
        }
        const handler = new BuyItem(this.db);
        return await handler.execute(params);
    }

    async sellItem(params) {
        if (!params.token || !params.itemId) {
            return { error: 242 };
        }
        const handler = new SellItem(this.db);
        return await handler.execute(params);
    }

    async useArrow(params) {
        if (!params.token) {
            return { error: 242 };
        }
        const handler = new UseArrow(this.db);
        return await handler.execute(params);
    }

    async usePotion(params) {
        if (!params.token) {
            return { error: 242 };
        }
        const handler = new UsePotion(this.db);
        return await handler.execute(params);
    }

    async getItemsData(params) {
        if (!params.token) {
            return { error: 242 };
        }
        const handler = new GetItemsData(this.db);
        return await handler.execute();
    }
}

module.exports = ItemsManager;