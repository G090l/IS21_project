import { EITEMTYPE } from "../../../config";

type TItem = {
    cost: number;
}

class Item {
    public itemType: EITEMTYPE | null;
    public cost: number;

    constructor(options: TItem) {
        const { cost } = options;
        this.cost = cost;
        this.itemType = null;
    }
}

export default Item;