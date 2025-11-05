import { EDIRECTION } from "../../config";
import CharacterClass, { KNIGHT } from "./CharacterClass";
import Unit from "./Unit";
import Projectile from "./Projectile";
import Sword from "./Sword";

class Hero extends Unit {
    private characterClass: CharacterClass = KNIGHT;
    private equipment: string[] = [];
    private inventory: string[] = [...KNIGHT.inventory];
    public isAttacking: boolean = false;

    constructor() {
        super();
        this.rect.x = 100;
        this.rect.y = 100;
        this.speed = 8;
        this.rect.width = 100;
        this.rect.height = 100;
        this.damage = this.characterClass.damage;
    };

    getCharacterClass(): CharacterClass {
        return this.characterClass;
    }

    getEquipment(): string[] {
        return [...this.equipment];
    }

    getInventory(): string[] {
        return [...this.inventory];
    }

    getAttackPosition(): Sword | null {
        if (!this.isAttacking) {
            return null;
        }

        const swordWidth = 100;
        const swordHeight = 100;

        const x = this.direction === EDIRECTION.RIGHT
            ? this.rect.x + 100
            : this.rect.x - 100;

        return new Sword({
            x,
            y: this.rect.y,
            damage: this.damage,
            width: swordWidth,
            height: swordHeight
        });
    }

    createProjectile(): Projectile {
        const projectileX = this.direction === EDIRECTION.RIGHT
            ? this.rect.x + this.rect.width + 1
            : this.rect.x - 31;
        const projectileY = this.rect.y + (this.rect.height / 2);

        return new Projectile({
            direction: this.direction,
            x: projectileX,
            y: projectileY
        });
    }

    addToInventory(item: string): void {
        this.inventory.push(item);
    }

    removeFromInventory(item: string): void {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
        }
    }

    equipItem(item: string): void {
        this.equipment.push(item);
    }

    unequipItem(item: string): void {
        const index = this.equipment.indexOf(item);
        if (index > -1) {
            this.equipment.splice(index, 1);
        }
    }
}

export default Hero;