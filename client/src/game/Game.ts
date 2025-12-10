import CONFIG, { TRect, EDIRECTION } from "../config";
import GameMap from "./types/Map";
import Hero from "./types/Hero";
import Server from "../services/server/Server";
import Arrow from "./types/Arrow";
import Enemy from "./types/Enemy";
import { couldStartTrivia } from "typescript";

class Game {
    private server: Server;
    private heroes: Hero[];
    private walls: TRect[];
    private gameMap: GameMap;
    private arrows: Arrow[];
    private enemies: Enemy[];
    private interval: NodeJS.Timer | null = null;
    private enemyAttackCooldowns: Map<Enemy, number> = new Map();

    constructor(server: Server) {
        this.server = server;
        this.heroes = [];
        this.gameMap = new GameMap();
        this.walls = this.gameMap.walls;
        this.arrows = [];
        this.enemies = [new Enemy()];
        this.createHeroWithUserNickname();

        //this.server.startGetScene(() => this.getSceneFromBackend());
        this.startUpdateScene();
    }

    private createHeroWithUserNickname(): void {
        const user = this.server.store.getUser();
        if (user && user.nickname) {
            const hero = new Hero();
            hero.name = user.nickname;
            this.heroes.push(hero);
        } else {
            const hero = new Hero();
            hero.name = "Player";
            this.heroes.push(hero);
        }
    }

    private getCurrentUserHero(): Hero | null {
        const user = this.server.store.getUser();
        if (!user || !user.nickname) return null;

        return this.heroes.find(hero => hero.name === user.nickname) || null;
    }

    destructor() {
        this.stopUpdateScene();
        //this.server.stopGetScene();
    }

    getScene() {
        return {
            heroes: this.heroes.map(hero => hero),
            walls: this.walls,
            arrows: this.arrows.map(arrow => arrow),
            enemies: this.enemies.map(enemy => enemy),
        };
    }

    addArrow(): void {
        const hero = this.getCurrentUserHero();
        if (!hero) return;

        const arrow = hero.createProjectile();
        this.arrows.push(arrow);
    }

    handleSwordAttack(): void {
        const hero = this.getCurrentUserHero();
        if (!hero) return;

        hero.isAttacking = true;

        const swordPosition = hero.getAttackPosition();
        if (!swordPosition) return;

        this.enemies.forEach(enemy => {
            if (enemy.isAlive() && hero.checkRectCollision(swordPosition, enemy.rect)) {
                enemy.takeDamage(hero.damage);
            }
        });

        setTimeout(() => {
            hero.isAttacking = false;
        }, 300);
    }

    handleBlock(): void {
        const hero = this.getCurrentUserHero();
        if (!hero) return;

        hero.isBlocking = true;
    }

    handleUnblock(): void {
        const hero = this.getCurrentUserHero();
        if (!hero) return;

        hero.isBlocking = false;
    }

    updateCurrentUserMovement(dx: number, dy: number): void {
        const hero = this.getCurrentUserHero();
        if (!hero) return;
        hero.movement.dx = dx;
        hero.movement.dy = dy;
    }

    private userIsOwner() {
    }

    private startUpdateScene() {
        if (this.interval) {
            this.stopUpdateScene();
        }
        this.interval = setInterval(
            () => this.updateScene(),
            CONFIG.GAME_UPDATE_TIMESTAMP
        );
    }

    private stopUpdateScene() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    // 100 ms
    private getSceneFromBackend() {
        // если пришёл ответ
        // распарсить его
        // принудительно применить к сцене игры
    }

    private updateEnemies(): void {
        const heroRects = this.heroes.map(hero => hero.rect);

        this.enemies.forEach(enemy => {
            if (enemy.isAlive()) {
                enemy.update(heroRects, this.walls);

                // Обработка атак врагов
                if (enemy.getIsAttacking()) {
                    this.handleEnemyAttack(enemy);
                }
            }
        });

        // Удаляем мертвых врагов
        this.enemies = this.enemies.filter(enemy => enemy.isAlive());
    }

    private handleEnemyAttack(enemy: Enemy): void {
        const currentTime = Date.now();
        const lastAttackTime = this.enemyAttackCooldowns.get(enemy) || 0;
        const attackCooldown = 1000;

        if (currentTime - lastAttackTime < attackCooldown) {
            return;
        }

        const attackPosition = enemy.getAttackPosition();

        this.heroes.forEach(hero => {
            if (hero.isAlive() && enemy.checkRectCollision(attackPosition, hero.rect)) {
                hero.takeDamage(enemy.damage);
                console.log(`Враг атаковал героя ${hero.name}! Здоровье: ${hero.health}`);

                this.enemyAttackCooldowns.set(enemy, currentTime);
            }
        });
    }

    private updateHeroes(): void {
        this.heroes.forEach(hero => {
            if (!hero.isAttacking && !hero.isBlocking) {
                const dx = hero.movement.dx * hero.speed;
                const dy = hero.movement.dy * hero.speed;

                const originalX = hero.rect.x;
                const originalY = hero.rect.y;

                hero.move(dx, dy);

                const hasCollision = hero.checkCollisionsWithArray(
                    this.walls,
                    (wall, heroRect) => {
                        hero.rect.x = originalX;
                        hero.rect.y = originalY;
                        return false;
                    }
                );
            }
        });
    }

    private updateArrows(): void {
        this.arrows = this.arrows.filter(arrow => {
            let shouldRemoveArrow = false;

            // Двигаем стрелу
            if (arrow.direction == EDIRECTION.RIGHT) {
                arrow.move(10, 0);
            } else {
                arrow.move(-10, 0);
            }

            // Проверка столкновений стрел со стенами
            const hitWall = arrow.checkCollisionsWithArray(
                this.walls,
                (wall, arrowRect) => {
                    shouldRemoveArrow = true;
                    return false;
                }
            );

            // Проверка столкновений стрел с врагами
            const enemyRects = this.enemies.map(enemy => enemy.rect);
            const hitEnemy = arrow.checkCollisionsWithArray(
                enemyRects,
                (enemyRect, arrowRect) => {
                    const enemy = this.enemies.find(e =>
                        e.rect.x === enemyRect.x &&
                        e.rect.y === enemyRect.y &&
                        e.rect.width === enemyRect.width &&
                        e.rect.height === enemyRect.height
                    );

                    if (enemy) {
                        enemy.takeDamage(arrow.damage);
                        shouldRemoveArrow = true;
                    }

                    return false;
                }
            );

            return !shouldRemoveArrow;
        });
    }

    private updateScene() {
        let isUpdated = false;

        // Обновляем всех героев
        this.updateHeroes();
        isUpdated = true;

        // Обновляем врагов
        this.updateEnemies();
        isUpdated = true;

        // Обновляем снаряды
        this.updateArrows();
        isUpdated = true;

        if (isUpdated) {
            // Логика отправки на сервер
        }
    }
}

export default Game;