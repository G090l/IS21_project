const BaseManager = require('../../BaseManager.js');

class GetItemsData extends BaseManager {
    constructor(db) {
        super(db);
    }

    async execute() {
        return this.db.getAllItemsData();
    }
}

module.exports = GetItemsData;