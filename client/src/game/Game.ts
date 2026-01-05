import CONFIG, { TRect, EDIRECTION } from "../config";
import Server from "../services/server/Server";
import Store from "../services/store/Store";
import GameMap from "./types/Map";
import Hero from "./types/Movement/Hero";
import Arrow from "./types/Movement/Arrow";
import Enemy from "./types/Movement/Enemy";
import { TRoomMember } from "../services/server/types";

class Game {
    private server: Server;
    private store: Store;
    private heroes: Hero[] = [];
    private walls: TRect[];
    private gameMap: GameMap;
    private arrows: Arrow[] = [];
    private enemies: Enemy[];
    private interval: NodeJS.Timer | null = null;
    private enemyAttackCooldowns: Map<Enemy, number> = new Map();

    private isUpdatedHero: boolean = false;
    private sceneUpdateInterval: NodeJS.Timer | null = null;

    constructor(server: Server, store: Store) {
        this.server = server;
        this.store = store;
        this.gameMap = new GameMap();
        this.walls = this.gameMap.walls;
        this.enemies = [new Enemy()];
        this.createHero();

        this.server.startGetScene((sceneData) => this.getSceneFromBackend(sceneData));
        this.startUpdateScene();
        this.startPeriodicHeroUpdate();
    }

    private createHero(): void {
        const { user, allItems, allClasses } = this.store;
        if (user) {
            // Передаем персонажу изначальные данные
            const { purchasedItems, selectedClass } = user;
            const hero = new Hero({ purchasedItems, selectedClass, allItems, allClasses });
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

    private getHeroByNickname(nickname: string): Hero | undefined {
        return this.heroes.find(hero => hero.name === nickname);
    }

    destructor() {
        this.stopUpdateScene();
        this.stopPeriodicHeroUpdate();
        this.server.stopGetScene();
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
        if (!hero || !hero.canShoot()) return;

        this.arrows.push(new Arrow(hero.createProjectile()));
        hero.setLastShotTime();
        this.isUpdatedHero = true;
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

        this.isUpdatedHero = true;
    }

    handleBlock(): void {
        const hero = this.getCurrentUserHero();
        if (!hero) return;
        hero.isBlocking = true;
        this.isUpdatedHero = true;
    }

    handleUnblock(): void {
        const hero = this.getCurrentUserHero();
        if (!hero) return;
        hero.isBlocking = false;
        this.isUpdatedHero = true;
    }

    updateCurrentUserMovement(dx: number, dy: number): void {
        const hero = this.getCurrentUserHero();
        if (!hero) return;
        hero.isMoving = dx || dy ? true : false
        hero.movement.dx = dx;
        hero.movement.dy = dy;
        this.isUpdatedHero = true;
    }

    private userIsOwner(): boolean {
        const user = this.store.getUser();
        const currentRoom = this.store.getUserRoom();
        return currentRoom?.members?.some(member =>
            member.userId === user?.userId && member.type === "owner"
        ) || false;
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

    private startPeriodicHeroUpdate(): void {
        this.sceneUpdateInterval = setInterval(async () => {
            await this.updateCurrentHeroOnServer();
        }, CONFIG.GAME_UPDATE_TIMESTAMP);
    }

    private stopPeriodicHeroUpdate(): void {
        if (this.sceneUpdateInterval) {
            clearInterval(this.sceneUpdateInterval);
            this.sceneUpdateInterval = null;
        }
    }

    private async updateCurrentHeroOnServer(): Promise<void> {
        const hero = this.getCurrentUserHero();
        if (!hero || !this.isUpdatedHero) return;

        try {
            const heroData = hero.toJSON();
            await this.server.updateCharacter(heroData);
            this.isUpdatedHero = false;
        } catch (error) {
            console.error('Failed to update hero on server:', error);
        }
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
                this.isUpdatedHero = true;

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
            arrow.checkCollisionsWithArray(
                this.walls,
                (wall, arrowRect) => {
                    shouldRemoveArrow = true;
                }
            );

            // Проверка столкновений стрел с врагами
            const enemyRects = this.enemies.map(enemy => enemy.rect);
            arrow.checkCollisionsWithArray(
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
                }
            );

            return !shouldRemoveArrow;
        });
    }

    private updateScene() {
        // Обновляем всех героев
        this.updateHeroes();

        // Обновляем врагов
        this.updateEnemies();

        // Обновляем снаряды
        this.updateArrows();

        // Логика отправки на сервер
        if (this.userIsOwner()) {
        }
    }

    private getSceneFromBackend(sceneData: any): void {
        if (sceneData.characters) {
            this.updateOtherHeroes(sceneData.characters);
        }
    }

    private updateOtherHeroes(characters: TRoomMember[]): void {
        const currentUser = this.store.getUser();

        characters.forEach((character: any) => {
            if (character.userId === currentUser?.userId) {
                return;
            }

            const existingHero = this.getHeroByNickname(character.nickname);

            if (!existingHero) {
                const hero = new Hero();
                hero.name = character.nickname;

                if (character.characterData) {
                    try {
                        hero.fromJSON(character.characterData);
                    } catch (error) {
                        console.error(`Failed to parse character data for ${character.nickname}:`, error);
                    }
                }

                this.heroes.push(hero);
                console.log(`Добавлен новый герой: ${character.nickname}`);
            } else if (character.characterData) {
                try {
                    existingHero.fromJSON(character.characterData);
                } catch (error) {
                    console.error(`Failed to update character data for ${character.nickname}:`, error);
                }
            }
        });

        const activeNicknames = characters.map(c => c.nickname);
        this.heroes = this.heroes.filter(hero => {
            if (hero.name === currentUser?.nickname) {
                return true;
            }
            return activeNicknames.includes(hero.name);
        });
    }
}

export default Game;