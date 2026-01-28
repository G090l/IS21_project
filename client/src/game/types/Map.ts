import { TRect } from "../../config";

class Map {
    walls: TRect[];

    constructor() {
        this.walls = [
            { x: 0, y: 0, width: 10, height: 1080 },
            { x: 0, y: 0, width: 1920, height: 500 },
            { x: 1910, y: 0, width: 10, height: 1080 },
            { x: 0, y: 1070, width: 1920, height: 10 },
        ];
    }
}
export default Map;