import CONFIG, { TRect, EDIRECTION } from "../config";
import Map from "./types/Map";
import Hero from "./types/Hero";
import Server from "../services/server/Server";
import Projectile from "./types/Projectile";
import Enemy from "./types/Enemy";
import Sword from "./types/Sword";

class Game {
    private server: Server;
    public Heroes: Hero[];
    private Walls: TRect[];
    private Swords: Sword[];
    private gameMap: Map;
    private Arrows: Projectile[];
    private Enemies: Enemy[];
    private interval: NodeJS.Timer | null = null;

    constructor(server: Server) {
        this.server = server;
        this.Heroes = [new Hero(), new Hero()];
        this.gameMap = new Map();
        this.Walls = this.gameMap.walls;
        this.Swords = [];
        this.Arrows = [];
        this.Enemies = [new Enemy()];
        //this.server.startGetScene(() => this.getSceneFromBackend());
        this.startUpdateScene();
    }

    destructor() {
        this.stopUpdateScene();
        //this.server.stopGetScene();
    }

    getScene() {
        return {
            Heroes: this.Heroes.map(hero => hero),
            Walls: this.Walls,
            Swords: this.Swords.map(sword => sword),
            Arrows: this.Arrows.map(arrow => arrow),
            Enemies: this.Enemies.map(enemy => enemy),
        };
    }

    addArrow(heroIndex: number = 0): void {
        if (heroIndex >= this.Heroes.length) return;

        const hero = this.Heroes[heroIndex];
        const arrow = hero.createProjectile();
        this.Arrows.push(arrow);
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

    private canMove(hero: Hero, newX: number, newY: number): boolean {
        const newRect: TRect = {
            x: newX,
            y: newY,
            width: hero.rect.width,
            height: hero.rect.height
        };

        if (this.Walls.find(wall => hero.checkRectCollision(newRect, wall))) {
            return false;
        }

        return true;
    }

    private checkSwordCollisions(): void {
        this.Swords.forEach(sword => {
            this.Enemies.forEach(enemy => {
                if (enemy.checkRectCollision(sword.rect, enemy.rect)) {
                    enemy.health -= sword.damage;
                }
            });
        });
    }

    private checkArrowCollisions(): void {
        this.Arrows = this.Arrows.filter(arrow => {
            // Проверка столкновений со стенами
            const hitWall = this.Walls.find(wall => {
                return this.Heroes.length > 0 ?
                    this.Heroes[0].checkRectCollision(arrow.rect, wall) : false;
            });

            // Проверка столкновений с врагами
            const hitEnemy = this.Enemies.find(enemy => {
                const hit = this.Heroes.length > 0 ?
                    this.Heroes[0].checkRectCollision(arrow.rect, enemy.rect) : false;

                if (hit) {
                    // Наносим урон врагу
                    enemy.health -= arrow.damage;
                }

                return hit;
            });

            return !hitWall && !hitEnemy;
        });
    }

    private updateEnemies(): void {
        this.Enemies.forEach(enemy => {
            if (enemy.isAlive()) {
                enemy.update(this.Heroes[0], this.Walls);
            }
        });

        // Удаляем мертвых врагов
        this.Enemies = this.Enemies.filter(enemy => enemy.isAlive());
    }

    private updateHeroes(): void {
        this.Heroes.forEach(hero => {
            const dx = hero.movement.dx * hero.speed;
            const dy = hero.movement.dy * hero.speed;

            if (this.canMove(hero, hero.rect.x + dx, hero.rect.y + dy) && !hero.isAttacking) {
                hero.move(dx, dy);
            }
        });
    }

    private updateArrows(): void {
        this.Arrows.forEach(arrow => {
            if (arrow.direction == "right") {
                arrow.move(10, 0)
            } else {
                arrow.move(-10, 0)
            }
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
        this.checkArrowCollisions();
        isUpdated = true;

        // Обновляем позиции мечей для всех героев
        this.Swords = this.Heroes.map(hero => hero.getAttackPosition()).filter((sword): sword is Sword => sword !== null);

        // Проверяем столкновения меча
        this.checkSwordCollisions();

        if (isUpdated) {
            // Логика отправки на сервер
        }
    }
}

export default Game;