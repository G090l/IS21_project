import React, { useEffect, useRef } from "react";
import CONFIG, { EDIRECTION } from "../../../config";
import Game from "../../../game/Game";
import { Canvas, useCanvas } from "../../../services/canvas";
import useSprites from "../hooks/useSprites";

const gameField = 'game-field';

enum EAttackMode {
    Sword = 'sword',
    Bow = 'bow'
}

const heroWalkRightSprites = [2, 3, 4, 5, 6, 7, 8];
const heroWalkLeftSprites = [12, 13, 14, 15, 16, 17, 18];
const heroIdleRightSprite = 1;
const heroIdleLeftSprite = 11;
const heroAttackRightSprites = [21, 22, 23, 24, 25];
const heroAttackLeftSprites = [31, 32, 33, 34, 35];
const heroBlockRightSprites = [41, 42, 43, 44, 45];
const heroBlockLeftSprites = [51, 52, 53, 54, 55];
const heroSwordRight = [26]
const heroSwordLeft = [36]

const GameCanvas: React.FC<{ game: Game }> = ({ game }) => {
    let canvas: Canvas | null = null;
    const animationFrameRef = useRef<number>(0);
    const attackModeRef = useRef<EAttackMode>(EAttackMode.Sword);
    const { WINDOW, SPRITE_SIZE } = CONFIG;

    const [
        [spritesImage],
        getSprite,
        animationFunctions
    ] = useSprites({
        heroWalkRight: heroWalkRightSprites,
        heroWalkLeft: heroWalkLeftSprites,
        heroAttackRight: heroAttackRightSprites,
        heroAttackLeft: heroAttackLeftSprites,
        heroBlockRight: heroBlockRightSprites,
        heroBlockLeft: heroBlockLeftSprites,
        heroSwordRight: heroSwordRight,
        heroSwordLeft: heroSwordLeft,
    });

    const keysPressedRef = useRef({
        w: false,
        a: false,
        s: false,
        d: false
    });

    function printGameObject(
        canvas: Canvas,
        { x = 0, y = 0, width = 0, height = 0 }: { x: number; y: number; width: number; height: number },
        color: string
    ): void {
        canvas.rectangle(x, y, width, height, color);
    }

    function printFillSprite(image: HTMLImageElement, canvas: Canvas, { x = 0, y = 0 }, points: number[]): void {
        canvas.spriteFull(image, x, y, points[0], points[1], points[2]);
    }

    function printHeroSprite(
        canvas: Canvas,
        { x = 0, y = 0 },
        hero: any
    ): void {
        let spriteNumber: number;

        if (hero.isBlocking) {
            if (hero.direction === EDIRECTION.RIGHT) {
                spriteNumber = animationFunctions.heroBlockRight()
            } else {
                spriteNumber = animationFunctions.heroBlockLeft()
            }
        } else if (hero.isAttacking) {
            if (hero.direction === EDIRECTION.RIGHT) {
                spriteNumber = animationFunctions.heroAttackRight()
            } else {
                spriteNumber = animationFunctions.heroAttackLeft()
            }
        } else if (hero.movement.dx || hero.movement.dy) {
            if (hero.direction === EDIRECTION.RIGHT) {
                spriteNumber = animationFunctions.heroWalkRight()
            } else {
                spriteNumber = animationFunctions.heroWalkLeft()
            }
        } else {
            spriteNumber = hero.direction === EDIRECTION.RIGHT ?
                heroIdleRightSprite :
                heroIdleLeftSprite;
        }

        const [sx, sy, size] = getSprite(spriteNumber);
        printFillSprite(spritesImage, canvas, { x, y }, [sx, sy, size]);
    }

    function printHeroSword(
        canvas: Canvas,
        { x = 0, y = 0 },
        hero: any
    ): void {
        let spriteNumber: number;
        if (hero.direction === EDIRECTION.RIGHT) {
            spriteNumber = animationFunctions.heroSwordRight()
        } else {
            spriteNumber = animationFunctions.heroSwordLeft()
        }
        const [sx, sy, size] = getSprite(spriteNumber);
        printFillSprite(spritesImage, canvas, { x, y }, [sx, sy, size]);
    }

    const render = (fps: number): void => {
        if (canvas && game) {
            canvas.clear();
            const scene = game.getScene();
            const { heroes, walls, arrows, enemies } = scene;

            for (let i = 0; i > walls.length; i++) {
                const wall = walls[i];
                printGameObject(canvas, {
                    x: wall.x,
                    y: wall.y,
                    width: wall.width,
                    height: wall.height
                }, 'brown');
            }

            heroes.forEach((hero, index) => {
                const color = index === 0 ? 'blue' : ['green', 'yellow', 'purple'][index % 3];
                printGameObject(canvas!, hero.rect, color);

                canvas!.text(hero.rect.x, hero.rect.y - 20, hero.name || "Неизвестно", 'white');

                if (hero.isAttacking && attackModeRef.current === EAttackMode.Sword) {
                    const attackPosition = hero.getAttackPosition();
                    if (attackPosition) {
                        printGameObject(canvas!, attackPosition, 'red');
                        printHeroSword(canvas!, {
                            x: hero.rect.x - SPRITE_SIZE + hero.rect.width + 100,
                            y: hero.rect.y - SPRITE_SIZE + hero.rect.height + 10
                        }, hero);
                    }
                }

                printHeroSprite(canvas!, {
                    x: hero.rect.x - SPRITE_SIZE + hero.rect.width + 100,
                    y: hero.rect.y - SPRITE_SIZE + hero.rect.height + 10
                }, hero);
            });

            enemies.forEach(enemy => {
                printGameObject(canvas!, enemy.rect, 'red');

                if (enemy.getIsAttacking()) {
                    const attackPosition = enemy.getAttackPosition();
                    if (attackPosition) {
                        printGameObject(canvas!, attackPosition, 'orange');
                    }
                }
            });

            arrows.forEach(arrow => {
                printGameObject(canvas!, {
                    x: arrow.rect.x,
                    y: arrow.rect.y,
                    width: arrow.rect.width,
                    height: arrow.rect.height
                }, "red");
            });

            canvas.text(WINDOW.LEFT + 20, WINDOW.TOP + 50, String(fps), 'green');

            canvas.render();
        }
    };

    const mouseClick = () => {
        if (attackModeRef.current === EAttackMode.Sword) {
            game.handleSwordAttack();
        } else if (attackModeRef.current === EAttackMode.Bow) {
            game.addArrow();
        }
    };

    const mouseRightClick = () => {
    };

    const handleMovement = () => {
        const { w, a, s, d } = keysPressedRef.current;

        let dx = 0;
        let dy = 0;

        if (a) dx -= 1;
        if (d) dx += 1;
        if (w) dy -= 1;
        if (s) dy += 1;

        game.updateCurrentUserMovement(dx, dy);
    };

    const changeAttackMode = (mode: EAttackMode) => {
        attackModeRef.current = mode;
    };

    useEffect(() => {
        canvas = useCanvas(render)({
            parentId: gameField,
            WIDTH: WINDOW.WIDTH,
            HEIGHT: WINDOW.HEIGHT,
            WINDOW,
            callbacks: {
                mouseMove: () => { },
                mouseClick,
                mouseRightClick,
            },
        });

        const gameLoop = () => {
            handleMovement();
            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        animationFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            canvas?.destructor();
            canvas = null;
        };
    });

    useEffect(() => {
        const keyDownHandler = (event: KeyboardEvent) => {
            const keyCode = event.keyCode ? event.keyCode : event.which ? event.which : 0;

            switch (keyCode) {
                case 65:
                    keysPressedRef.current.a = true;
                    break;
                case 68:
                    keysPressedRef.current.d = true;
                    break;
                case 87:
                    keysPressedRef.current.w = true;
                    break;
                case 83:
                    keysPressedRef.current.s = true;
                    break;
                case 49:
                    changeAttackMode(EAttackMode.Sword);
                    break;
                case 50:
                    changeAttackMode(EAttackMode.Bow);
                    break;
                default:
                    break;
            }
        };

        const keyUpHandler = (event: KeyboardEvent) => {
            const keyCode = event.keyCode ? event.keyCode : event.which ? event.which : 0;

            switch (keyCode) {
                case 65:
                    keysPressedRef.current.a = false;
                    break;
                case 68:
                    keysPressedRef.current.d = false;
                    break;
                case 87:
                    keysPressedRef.current.w = false;
                    break;
                case 83:
                    keysPressedRef.current.s = false;
                    break;
                default:
                    break;
            }
        };

        const mouseDownHandler = (event: MouseEvent) => {
            if (event.button === 2) {
                event.preventDefault();
                game.handleBlock();
            }
        };

        const mouseUpHandler = (event: MouseEvent) => {
            if (event.button === 2) {
                game.handleUnblock();
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);
        document.addEventListener('mousedown', mouseDownHandler);
        document.addEventListener('mouseup', mouseUpHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
            document.removeEventListener('mousedown', mouseDownHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };
    });

    return (<div id={gameField} className={gameField}></div>);
}

export default GameCanvas;