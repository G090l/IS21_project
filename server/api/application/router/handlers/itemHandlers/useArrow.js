const BaseManager = require('../../BaseManager.js');

class UseArrow extends BaseManager {

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
        //проверка наличия лука
        const hasBow = await this.db.hasCharacterWeaponType(character.id, 'bow');
        if (!hasBow) {
            return { error: 4008 };
        }

        //проверка наличия стрел
        const hasArrows = await this.db.hasCharacterArrows(character.id);
        if (!hasArrows) {
            return { error: 4009 };
        }

        //используем стрелу
        return await this.useArrow(character.id);
    }
}


module.exports = UseArrow;