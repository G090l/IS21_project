import Item from "./Item";
import { EITEMTYPE, EWEAPONTYPE } from "../../../config";

type TWeapon = {
    type: EITEMTYPE.WEAPON;
    cost: number;
    damage: number;
    weaponType: EWEAPONTYPE;
    weaponDistance: number;
}

class Weapon extends Item {
    public damage: number;
    public width: number;
    public weaponType: EWEAPONTYPE;
    constructor(options: TWeapon) {
        const { cost, weaponType, damage,  weaponDistance = 0} = options;
        super({ cost });
        this.itemType = EITEMTYPE.WEAPON;
        this.weaponType = weaponType;
        this.damage = damage;
        this.width = weaponDistance; //возможно коэф увеличения атаки!!
    }
}

export default Weapon;