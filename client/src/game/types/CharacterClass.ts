import { ECLASSTYPE } from "../../config";

export type TCharacterClass = {
    name: string,
    type: ECLASSTYPE
    hp: number,
    defense: number,
    speed: number
}

class CharacterClass {
    public name: string;
    public type: ECLASSTYPE;
    public hp: number;
    public defense: number;
    public speed: number;

    constructor(options: TCharacterClass) {
        const { name, hp, type, defense, speed } = options;
        this.name = name;
        this.type = type;
        this.hp = hp;
        this.defense = defense;
        this.speed = speed;
    }

}

export default CharacterClass;