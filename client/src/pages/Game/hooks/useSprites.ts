import CONFIG from '../../../config';
import hero from '../../../assets/img/hero.png';

const heroSprites = {
    walkRightSprites: [2, 3, 4, 5, 6, 7, 8],
    walkLeftSprites: [12, 13, 14, 15, 16, 17, 18],
    idleRightSprite: 1,
    idleLeftSprite: 11,
    attackRightSprites: [21, 22, 23, 24, 25],
    attackLeftSprites: [31, 32, 33, 34, 35],
    blockRightSprites: [45],
    blockLeftSprites: [55],
    swordRight: [26],
    swordLeft: [36],
};

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

interface UseSpritesReturn {
    spritesImage: HTMLImageElement;
    getSprite: (spriteNo: number) => number[];
    animationFunctions: Record<string, () => number>;
    heroSprites: typeof heroSprites;
}

const useSprites = (): UseSpritesReturn => {
    const { SPRITE_SIZE, LINE_OF_SPRITES } = CONFIG;
    const spritesImage = new Image();
    spritesImage.src = hero;

    const getSprite = (spriteNo: number): number[] => {
        const y = Math.trunc(spriteNo / LINE_OF_SPRITES) * SPRITE_SIZE;
        const x = (spriteNo % LINE_OF_SPRITES - 1) * SPRITE_SIZE;
        return [x, y, SPRITE_SIZE];
    }

    const animationFunctions: Record<string, () => number> = {};

    Object.entries({
        heroWalkRight: heroSprites.walkRightSprites,
        heroWalkLeft: heroSprites.walkLeftSprites,
        heroAttackRight: heroSprites.attackRightSprites,
        heroAttackLeft: heroSprites.attackLeftSprites,
        heroBlockRight: heroSprites.blockRightSprites,
        heroBlockLeft: heroSprites.blockLeftSprites,
        heroSwordRight: heroSprites.swordRight,
        heroSwordLeft: heroSprites.swordLeft,
    }).forEach(([key, frames]) => {
        animationFunctions[key] = getSpritesFromFrame(frames);
    });

    return {
        spritesImage,
        getSprite,
        animationFunctions,
        heroSprites: heroSprites,
    };
}

export default useSprites;