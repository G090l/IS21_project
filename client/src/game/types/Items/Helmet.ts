import Item from "./Item";
import { EITEMTYPE, TARMOR } from "../../../config";


class Helmet extends Item {
    public bonusDefense: number;
    constructor(options: TARMOR) {
        const { cost, bonusDefense } = options;
        super({ cost });
        this.itemType = EITEMTYPE.HELMET;
        this.bonusDefense = bonusDefense; 
    }
}

export default Helmet;