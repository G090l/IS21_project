import { TRect, EDIRECTION } from "../../config";
import Unit from "./Unit";

class Enemy extends Unit {
    private detectionRange: number;

    constructor() {
        super();
        this.rect.x = 500;
        this.rect.y = 200;
        this.speed = 5;
        this.rect.width = 80;
        this.rect.height = 80;
        this.health = 100;
        this.damage = 20;
        this.detectionRange = 300;
        this.direction = EDIRECTION.RIGHT;
    }

    update(heroRects: TRect[], walls: TRect[]): void {
        this.moveTowardsTarget(heroRects, walls);
        //attack()
    }

    private moveTowardsTarget(heroRects: TRect[], walls: TRect[]): void {
        const nearestHeroRect = this.findNearestHeroRect(heroRects);

        if (!nearestHeroRect) {
            this.movement.dx = 0;
            this.movement.dy = 0;
            return;
        }

        const dx = nearestHeroRect.x - this.rect.x;
        const dy = nearestHeroRect.y - this.rect.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Нормализуем направление
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;

        // Рассчитываем новую позицию
        const newX = normalizedDx * this.speed;
        const newY = normalizedDy * this.speed;

        // Сохраняем оригинальную позицию для отката при столкновении
        const originalX = this.rect.x;
        const originalY = this.rect.y;

        // Пытаемся переместиться
        this.move(newX, newY);

        // Проверяем столкновения со стенами
        const hasCollision = this.checkCollisionsWithArray(
            walls,
            (wall, enemyRect) => {
                // При столкновении откатываем позицию
                this.rect.x = originalX;
                this.rect.y = originalY;
                return false;
            }
        );

        // Обновляем направление
        if (normalizedDx !== 0) {
            this.direction = normalizedDx > 0 ? EDIRECTION.RIGHT : EDIRECTION.LEFT;
        }
    }

    private findNearestHeroRect(heroRects: TRect[]): TRect | null {
        let nearestHeroRect: TRect | null = null;
        let minDistance = this.detectionRange;

        for (const heroRect of heroRects) {
            const dx = heroRect.x - this.rect.x;
            const dy = heroRect.y - this.rect.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.detectionRange && distance < minDistance) {
                minDistance = distance;
                nearestHeroRect = heroRect;
            }
        }

        return nearestHeroRect;
    }

    takeDamage(damage: number): void {
        this.health -= damage;

        if (this.health < 0) {
            this.health = 0;
        }
    }

    getAttackPosition(): TRect {
        const swordOffset = 80;
        const swordSize = 80;

        const x = this.direction === EDIRECTION.RIGHT
            ? this.rect.x + swordOffset
            : this.rect.x - swordOffset;

        return {
            x,
            y: this.rect.y,
            width: swordSize,
            height: swordSize
        };
    }

    isAlive(): boolean {
        return this.health > 0;
    }
}

export default Enemy;