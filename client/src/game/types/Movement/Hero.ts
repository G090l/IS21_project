import { ECLASSTYPE, EDIRECTION, EITEMTYPE, TRect } from "../../../config";
import CharacterClass from "../CharacterClass";
import Unit from "./Unit";
import Chestplate from "../Items/Chestplate";
import Helmet from "../Items/Helmet";
import Leggings from "../Items/Leggings";
import Weapon from "../Items/Weapon";
import Shield from "../Items/Shield";
import Item from "../Items/Item";
import { TClass, TItem } from "../../../services/server/types";

type TOptions = {
    purchasedItems: {itemId: number; quantity: number}[],
    selectedClass: number,
    allItems: TItem[],
    allClasses: TClass[]
}

type TEquipment = {
    helmet: Helmet | null,
    chestplate: Chestplate | null,
    leggings: Leggings | null,
    weapon: Weapon | null,
    shield: Shield | null
}

type TInventory = {
    arrows: number,
    potions: number
}

const BLOCK_DAMAGE_REDUCTION = 0.5;

class Hero extends Unit {
    public isAttacking: boolean = false;
    public isBlocking: boolean = false;
    private lastShotTime: number = 0;
    private characterClassType: ECLASSTYPE = ECLASSTYPE.WARRIOR;
    private equipment: TEquipment | null = null;
    public inventory: TInventory | null = null;

    constructor(options: TOptions | null = null) {
        super();
        this.rect.x = 800;
        this.rect.y = 800;
        this.speed = 8;
        this.rect.width = 100;
        this.rect.height = 100;
        this.damage = 10;
        this.health = 100;

        //Если владелец персонажа - owner, заполняем снаряжение
        console.log(options);
        if (options) {
            this.equipment = {
                helmet: null,
                chestplate: null,
                leggings: null,
                weapon: null,
                shield: null
            }
            this.setEquipmentAndClass(options);
            this.inventory = { potions: 0, arrows: 0};
        }
    };

    public toJSON(): string {
        const heroData = {
            rect: {
                x: this.rect.x,
                y: this.rect.y,
                width: this.rect.width,
                height: this.rect.height
            },
            speed: this.speed,
            damage: this.damage,
            health: this.health,
            direction: this.direction,
            movement: {
                dx: this.movement.dx,
                dy: this.movement.dy
            },
            name: this.name,
        };

        return JSON.stringify(heroData);
    }

    public fromJSON(jsonString: string) {
        const data = JSON.parse(jsonString);

        this.rect.x = data.rect.x;
        this.rect.y = data.rect.y;
        this.rect.width = data.rect.width;
        this.rect.height = data.rect.height;
        this.speed = data.speed;
        this.damage = data.damage;
        this.health = data.health;
        this.direction = data.direction;
        this.movement.dx = data.movement.dx;
        this.movement.dy = data.movement.dy;
        this.name = data.name;
    }

    getCharacterClassType(): ECLASSTYPE {
        return this.characterClassType;
    }

    getEquipment(): TEquipment {
        return this.equipment!;
    }

    getInventory(): TInventory {
        return this.inventory!;
    }

    getAttackPosition(): TRect | null {
        if (!this.isAttacking) {
            return null;
        }

        const swordWidth = 100;
        const swordHeight = 100;

        const x = this.direction === EDIRECTION.RIGHT
            ? this.rect.x + 100
            : this.rect.x - 100;
        return {
            x,
            y: this.rect.y,
            width: swordWidth,
            height: swordHeight
        };
    }

    createProjectile() {
        const projectileX = this.direction === EDIRECTION.RIGHT
            ? this.rect.x + this.rect.width + 1
            : this.rect.x - 31;
        const projectileY = this.rect.y + (this.rect.height / 2);

        return {
            direction: this.direction,
            x: projectileX,
            y: projectileY
        };
    }

    canShoot(): boolean {
        const currentTime = Date.now();
        return currentTime - this.lastShotTime >= 500;
    }

    setLastShotTime(): void {
        this.lastShotTime = Date.now();
    }

    changeClass(characterClass: CharacterClass): void {
        this.characterClassType = characterClass.type;
        this.health = characterClass.hp;
        this.speed = characterClass.speed;

        // Поле имеется в классе, но пока не реализовано
        // this.defense = characterClass.defense;
    }

    equipItem(item: Item): void {
        if (!this.equipment) return;
        switch (item.itemType) {
            case EITEMTYPE.WEAPON:
                this.equipment.weapon = item as Weapon;
                break;
            case EITEMTYPE.SHIELD:
                this.equipment.shield = item as Shield;
                break;
            case EITEMTYPE.HELMET:
                this.equipment.helmet = item as Helmet;
                break;
            case EITEMTYPE.CHESTPLATE:
                this.equipment.chestplate = item as Chestplate;
                break;
            case EITEMTYPE.LEGGINGS:
                this.equipment.leggings = item as Leggings;
                break;
            default:
                console.log("Попытка экипировки неизвестного предмета");
        }
    }

    setEquipmentAndClass(options: TOptions): void {
        const { purchasedItems, selectedClass, allItems, allClasses } = options;
        purchasedItems.forEach(userItem => {
            const id = userItem.itemId;
            const item = allItems.find(item => item.id === id);
            if (item) this.equipItem(item);
        });
        const characterClass = allClasses.find(charClass => charClass.id === selectedClass);
        console.log(characterClass);
        if (characterClass) this.changeClass(characterClass);
    }

    takeDamage(damage: number): void {
        let finalDamage = damage;

        if (this.isBlocking) {
            finalDamage = damage * BLOCK_DAMAGE_REDUCTION;
        }

        this.health -= finalDamage;

        if (this.health < 0) {
            this.health = 0;
        }
    }

    isAlive(): boolean {
        return this.health > 0;
    }
}

export default Hero;