import Movement from "./Movement";
import { EDIRECTION, TRect } from "../../../config";

// Интерфейс Attack
interface IAttack {
    damage: number;
}

type TArrowOptions = {
    direction?: EDIRECTION;
    x?: number;
    y?: number;
    damage?: number;
    speed?: number;
    width?: number;
    height?: number;
}

export class Arrow extends Movement implements IAttack {
    public damage: number;

    constructor(options: TArrowOptions = {}) {
        const {
            direction = EDIRECTION.RIGHT,
            x = 0,
            y = 0,
            damage = 25,
            speed = 5,
            width = 30,
            height = 10
        } = options;

        const rect: TRect = {
            x,
            y,
            width,
            height
        };

        super({ rect, direction, speed });

        this.damage = damage;
    }
}

export default Arrow;