import Movement from "./Movement";
import { EDIRECTION, TRect } from "../../../config";

type TUnitOptions = {
    name?: string;
    health?: number;
    damage?: number;
    rect?: TRect;
    direction?: EDIRECTION;
    speed?: number;
}

class Unit extends Movement {
    public name: string;
    public health: number;
    public damage: number;

    constructor(options: TUnitOptions = {}) {
        const {
            name = "",
            health = 0,
            damage = 0,
            rect = { x: 0, y: 0, width: 0, height: 0 },
            direction = EDIRECTION.RIGHT,
            speed = 0
        } = options;

        super({ rect, direction, speed });

        this.name = name;
        this.health = health;
        this.damage = damage;
    }

    takeDamage(damage: number): void {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
        }
    }

    isAlive(): boolean {
        return this.health > 0;
    }
}

export default Unit;