const BaseHandler = require('../../BaseHandler.js');

class GetItemsData extends BaseHandler {
    constructor(db) {
        super(db);
    }

    async execute() {
        return this.db.getAllItemsData();
    }
}

module.exports = GetItemsData;