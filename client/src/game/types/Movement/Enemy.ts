import { TRect, EDIRECTION } from "../../../config";
import Unit from "./Unit";

class Enemy extends Unit {
    private detectionRange: number;
    private attackRange: number;
    public isAttacking: boolean;
    public isMoving: boolean;

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
        this.attackRange = 80;
        this.isMoving = false;
        this.isAttacking = false;
        this.direction = EDIRECTION.RIGHT;
    }

    update(heroRects: TRect[], walls: TRect[]): void {
        this.moveTowardsTarget(heroRects, walls);
    }

    private moveTowardsTarget(heroRects: TRect[], walls: TRect[]): void {
        const nearestHeroRect = this.findNearestHeroRect(heroRects);
        this.isAttacking = false;
        this.isMoving = false;

        if (!nearestHeroRect) {
            this.movement.dx = 0;
            this.movement.dy = 0;
            return;
        }

        const dx = nearestHeroRect.x - this.rect.x;
        const dy = nearestHeroRect.y - this.rect.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.attackRange) {
            this.movement.dx = 0;
            this.movement.dy = 0;
            this.isAttacking = true;
            return;
        }

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
        this.isMoving = true;

        // Проверяем столкновения со стенами
        this.checkCollisionsWithArray(
            walls,
            (wall, enemyRect) => {
                // При столкновении откатываем позицию
                this.rect.x = originalX;
                this.rect.y = originalY;
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

    getAttackPosition(): TRect {
        const swordSize = 80;

        const x = this.direction === EDIRECTION.RIGHT
            ? this.rect.x + swordSize
            : this.rect.x - swordSize;

        return {
            x,
            y: this.rect.y,
            width: swordSize,
            height: swordSize
        };
    }
}

export default Enemy;