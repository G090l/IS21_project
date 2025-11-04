import { EDIRECTION, TRect } from "../../config";

// Интерфейс Attack
interface IAttack {
    damage: number;
    rect: TRect;
}
type TSwordOptions = {
    x?: number;
    y?: number;
    damage?: number;
    width?: number;
    height?: number;
}

export class Sword implements IAttack {
    public damage: number;
    public rect: TRect;

    constructor(options: TSwordOptions = {}) {
        const {
            x = 0,
            y = 0,
            damage = 0,
            width = 0,
            height = 0
        } = options;

        this.rect = {
            x,
            y,
            width,
            height
        };

        this.damage = damage;
    }
}

export default Sword;