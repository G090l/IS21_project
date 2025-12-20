import Item from "./Item";
import { EITEMTYPE, TARMOR } from "../../../config";


class Chestplate extends Item {
    public bonusDefense: number;
    constructor(options: TARMOR) {
        const { cost, bonusDefense } = options;
        super({ cost });
        this.itemType = EITEMTYPE.CHESTPLATE;
        this.bonusDefense = bonusDefense; 
    }
}

export default Chestplate;