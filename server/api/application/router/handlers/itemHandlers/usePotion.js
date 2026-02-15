const BaseManager = require('../../BaseManager.js');

class UsePotion extends BaseManager {

    constructor(db) {
        super(db);
    }

    async execute(params) {
        const { userId } = params
        //проверка пользователя
        const user = await this.checkUserExists(userId);
        if (user.error) {
            return user;
        }
        // проверка персонажа
        const character = await this.checkCharacterExists(userId);
        if (character.error) {
            return character;
        }
        //проверка наличия зелий
        const hasPotion = await this.db.hasCharacterPotion(character.id);
        if (!hasPotion) {
            return { error: 4009 };
        }
        //используем зелье
        return await this.usePotion(character.id);
    }
}


module.exports = UsePotion;