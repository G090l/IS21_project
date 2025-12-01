import CONFIG from '../../../config';
import walk from '../../../assets/img/walk.png';

// взять спрайт для обычной анимации
const getSpritesFromFrame = (frame: number[]) => {
    const count = {
        frame: 0,
        timestamp: Date.now(),
    };

    return (): number => {
        const currentTimestamp = Date.now();
        if (currentTimestamp - count.timestamp >= 160) {
            count.timestamp = currentTimestamp;
            if (count.frame >= 0) {
                count.frame++;
                if (count.frame >= frame.length) {
                    count.frame = 0;
                }
            }
        }
        return frame[count.frame];
    }
}

const useSprites = (animations?: Record<string, number[]>): [
    HTMLImageElement[],
    (spriteNo: number) => number[],
    Record<string, () => number>
] => {
    const { SPRITE_SIZE, LINE_OF_SPRITES } = CONFIG;
    const spritesImage = new Image();
    spritesImage.src = walk;

    const getSprite = (spriteNo: number): number[] => {
        const y = Math.trunc(spriteNo / LINE_OF_SPRITES) * SPRITE_SIZE;
        const x = (spriteNo % LINE_OF_SPRITES - 1) * SPRITE_SIZE;
        return [x, y, SPRITE_SIZE];
    }

    const animationFunctions: Record<string, () => number> = {};

    if (animations) {
        Object.keys(animations).forEach(key => {
            animationFunctions[key] = getSpritesFromFrame(animations[key]);
        });
    }

    return [
        [spritesImage],
        getSprite,
        animationFunctions
    ];
}

export default useSprites;