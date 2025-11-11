import { EDIRECTION, TRect } from "../../config";

type TMovementOptions = {
    rect: TRect;
    direction: EDIRECTION;
    speed: number;
}

type TCollisionCallback = (collidedRect: TRect, currentRect: TRect) => boolean;

class Movement {
    public rect: TRect;
    public direction: EDIRECTION;
    public speed: number;
    public movement: { dx: number, dy: number };

    constructor(options: TMovementOptions) {
        const {
            rect,
            direction,
            speed,
        } = options;

        this.rect = rect;
        this.direction = direction;
        this.speed = speed;
        this.movement = { dx: 0, dy: 0 };
    }

    move(dx: number, dy: number): void {
        this.rect.x += dx;
        this.rect.y += dy;
        if (dx) {
            this.direction = dx > 0 ? EDIRECTION.RIGHT : EDIRECTION.LEFT;
        }
    }

    checkRectCollision(rect1: TRect, rect2: TRect): boolean {
        return (rect1.x + rect1.width > rect2.x) &&
            (rect1.x < rect2.x + rect2.width) &&
            (rect1.y + rect1.height > rect2.y) &&
            (rect1.y < rect2.y + rect2.height);
    }

    checkCollisionsWithArray(
        rects: TRect[],
        collisionCallback?: TCollisionCallback
    ): boolean {
        let hasCollision = false;

        for (const otherRect of rects) {
            if (this.checkRectCollision(this.rect, otherRect)) {
                hasCollision = true;

                if (collisionCallback) {
                    const shouldContinue = collisionCallback(otherRect, this.rect);

                    if (!shouldContinue) {
                        break;
                    }
                }
            }
        }

        return hasCollision;
    }
}

export default Movement;