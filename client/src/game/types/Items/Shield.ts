import Item from "./Item";
import { EITEMTYPE, TARMOR } from "../../../config";

class Shield extends Item {
    public bonusDefense: number;
    constructor(options: TARMOR) {
        const { cost, bonusDefense } = options;
        super({ cost });
        this.itemType = EITEMTYPE.SHIELD;
        this.bonusDefense = bonusDefense; 
    }
}

export default Shield;