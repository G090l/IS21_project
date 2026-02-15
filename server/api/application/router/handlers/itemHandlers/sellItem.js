const BaseManager = require('../../BaseManager.js');

class SellItem extends BaseManager {
    constructor(db) {
        super(db);
    }

    async execute(params) {
        const { userId, itemId } = params;
        // проверка пользователя
        const user = await this.checkUserExists(userId);
        if (user.error) {
            return user;
        }
        // проверка персонажа
        const character = await this.checkCharacterExists(userId);
        if (character.error) {
            return character;
        }
        // проверка, существует ли предмет
        const item = await this.db.getItemById(itemId);
        if (!item) {
            return { error: 4001 };
        }
        // проверка, есть ли предмет в инвентаре
        const userItem = await this.db.getUserItem(character.id, item.id);
        if (!userItem) {
            return { error: 4006 }
        }
        const sellPrice = Math.round(item.cost);

        //начинаем транзакцию
        const connection = await this.db.beginTransaction();
        try {
            // уменьшаем количество расходников или удаляем предмет 
            if ( ['potion', 'arrow'].includes(item.itemType) && userItem.quantity > 1) {
                // уменьшяем количество расходников
                const itemUpdated = this.db.updateUserItemQuantity(character.id, itemId, userItem.quantity - 1);
                if (!itemUpdated) {
                    await this.db.rollback(connection);
                    return { error: 4007 };
                }
            } else {
                // удаляем предмет
                const itemDeleted = await this.db.deleteUserItem(character.id, itemId);
                if (!itemDeleted) {
                    await this.db.rollback(connection);
                    return { error: 4007 };
                }
            }
            // записываем деньги
            const moneyUpdated = await this.db.updateCharacterMoneyAdd(character.id, sellPrice);
            if (!moneyUpdated) {
                await this.db.rollback(connection);
                return { error: 4007 };
            }
            await this.db.commit(connection);
            return true;
        } catch (e) {
            await this.db.rollback(connection);
            return { error: 4007 };
        }
    }
}

module.exports = SellItem;