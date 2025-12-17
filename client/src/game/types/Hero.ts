import { EDIRECTION, TRect } from "../../config";
import CharacterClass, { KNIGHT } from "./CharacterClass";
import Unit from "./Unit";

class Hero extends Unit {
    private characterClass: CharacterClass = KNIGHT;
    private equipment: string[] = [];
    private inventory: string[] = [...KNIGHT.inventory];
    public isAttacking: boolean = false;
    public isBlocking: boolean = false;
    private blockDamageReduction: number = 0.5;
    private lastShotTime: number = 0;

    constructor() {
        super();
        this.rect.x = 800;
        this.rect.y = 800;
        this.speed = 8;
        this.rect.width = 100;
        this.rect.height = 100;
        this.damage = this.characterClass.damage;
        this.health = 100;
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

    getCharacterClass(): CharacterClass {
        return this.characterClass;
    }

    getEquipment(): string[] {
        return [...this.equipment];
    }

    getInventory(): string[] {
        return [...this.inventory];
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

    takeDamage(damage: number): void {
        let finalDamage = damage;

        if (this.isBlocking) {
            finalDamage = damage * this.blockDamageReduction;
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