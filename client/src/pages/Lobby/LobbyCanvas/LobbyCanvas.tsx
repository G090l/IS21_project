import React, { useEffect, useState, useRef, useContext, useCallback, useMemo } from 'react';
import { ServerContext, StoreContext } from '../../../App';
import CONFIG, { EDIRECTION } from "../../../config";
import { Canvas, useCanvas } from "../../../services/canvas";
import { IBasePage, PAGES } from '../../PageManager';
import { useRoomUser } from '../../../hooks/useRoomUser';
import LobbyGame from '../../../lobby/LobbyGame';
import useSprites from '../../Game/hooks/useSprites';

import menuBackground from '../../../assets/img/lobby/menu-background.png';
import lobbyBackground from '../../../assets/img/lobby/lobby-background.png';

const lobbyField = 'lobby-field';
let bg = new Image();
bg.src = menuBackground;

let game: LobbyGame | null = null;
let canvas: Canvas;

let movementKeys = {
    w: false,
    a: false,
    s: false,
    d: false
};

type TLobbyCanvas = IBasePage & {
    setGame: (game: LobbyGame) => void;
    setPage: (page: PAGES) => void;
    openLobbyBook: () => void;
    openClassShop: () => void;
    isMovementBlocked: boolean;
};

const LobbyCanvas: React.FC<TLobbyCanvas> = (props: TLobbyCanvas) => {
    const { setGame, setPage, openLobbyBook, openClassShop, isMovementBlocked } = props;
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const Canvas = useCanvas(render);
    const { WINDOW, SPRITE_SIZE } = CONFIG;
    const user = store.getUser();
    const room = store.getUserRoom();
    const { isUserRoomMember } = useRoomUser(room, user);

    const {
        spritesImage,
        getSprite,
        animationFunctions,
        heroSprites
    } = useSprites();

    const heroIdleRightSprite = heroSprites.idleRightSprite;
    const heroIdleLeftSprite = heroSprites.idleLeftSprite;

    useEffect(() => {
        bg.src = isUserRoomMember ? lobbyBackground : menuBackground;
    }, [isUserRoomMember]);

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
            spriteNumber = hero.direction === EDIRECTION.RIGHT
                ? animationFunctions.heroBlockRight()
                : animationFunctions.heroBlockLeft();
        } else if (hero.isAttacking) {
            spriteNumber = hero.direction === EDIRECTION.RIGHT
                ? animationFunctions.heroAttackRight()
                : animationFunctions.heroAttackLeft();
        } else if (hero.isMoving) {
            spriteNumber = hero.direction === EDIRECTION.RIGHT
                ? animationFunctions.heroWalkRight()
                : animationFunctions.heroWalkLeft();
        } else {
            spriteNumber = hero.direction === EDIRECTION.RIGHT
                ? heroIdleRightSprite
                : heroIdleLeftSprite;
        }

        const [sx, sy, size] = getSprite(spriteNumber);
        printFillSprite(spritesImage, canvas, { x, y }, [sx, sy, size]);
    }

    function render(fps: number): void {
        if (!canvas || !game) return;
        canvas.clear();
        canvas.clearImage(bg);

        const scene = game.getScene();
        const { heroes, walls } = scene;

        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i];
            printGameObject(canvas, {
                x: wall.x,
                y: wall.y,
                width: wall.width,
                height: wall.height
            }, 'transparent');
        }

        heroes.forEach((hero, index) => {
            const color = index === 0 ? 'blue' : ['green', 'yellow', 'purple'][index % 3];
            printGameObject(canvas, hero.rect, color);

            canvas.text(hero.rect.x, hero.rect.y - 150, hero.name || "Неизвестно", 'white');

            printHeroSprite(canvas, {
                x: hero.rect.x - SPRITE_SIZE + hero.rect.width + 100,
                y: hero.rect.y - SPRITE_SIZE + hero.rect.height + 10
            }, hero);
        });

        canvas.text(WINDOW.LEFT + 20, WINDOW.TOP + 50, String(fps), 'green');
        canvas.render();
    }

    const handleMovement = () => {
        if (isMovementBlocked) {
            movementKeys = { w: false, a: false, s: false, d: false };
            return;
        }

        const { w, a, s, d } = movementKeys;
        let dx = 0, dy = 0;
        if (a) dx -= 1;
        if (d) dx += 1;
        if (w) dy -= 1;
        if (s) dy += 1;

        game?.updateCurrentUserMovement(dx, dy);
    };

    useEffect(() => {
        game = new LobbyGame(server, store);
        setGame(game);

        canvas = Canvas({
            parentId: lobbyField,
            WIDTH: WINDOW.WIDTH,
            HEIGHT: WINDOW.HEIGHT,
            WINDOW,
            callbacks: {
                mouseMove: () => { },
                mouseClick: () => { },
                mouseRightClick: () => { }
            },
        });

        let animationFrame: number;

        const gameLoop = () => {
            if (store.gameStatus == 'started' && store.rooms.length > 0) {
                setPage(PAGES.GAME);
            };
            handleMovement();
            animationFrame = requestAnimationFrame(gameLoop);
        };

        animationFrame = requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(animationFrame);
            canvas?.destructor();
        };
    }, []);

    useEffect(() => {
        const keyDownHandler = (event: KeyboardEvent) => {
            const keyCode = event.keyCode ? event.keyCode : event.which ? event.which : 0;
            if (document.activeElement?.tagName === 'INPUT' && keyCode === 70) return;
            if (isMovementBlocked) return;

            switch (keyCode) {
                case 65: // a
                    movementKeys.a = true;
                    break;
                case 68: // d
                    movementKeys.d = true;
                    break;
                case 87: // w
                    movementKeys.w = true;
                    break;
                case 83: // s
                    movementKeys.s = true;
                    break;
                case 70: // f
                    event.preventDefault();
                    if (game) {
                        const hero = game.getScene().heroes[0];

                        const inStartZone = hero.rect.x > 814 && hero.rect.x < 1105 &&
                            hero.rect.y > 685 && hero.rect.y < 770;

                        const inShopZone = hero.rect.x > 1455 && hero.rect.x < 1821 &&
                            hero.rect.y > 866 && hero.rect.y < 951;

                        if (inStartZone) {
                            openLobbyBook();
                        } else if (inShopZone) {
                            openClassShop();
                        }
                    }
                    break;
                default:
                    break;
            }
        };

        const keyUpHandler = (event: KeyboardEvent) => {
            const keyCode = event.keyCode ? event.keyCode : event.which ? event.which : 0;

            switch (keyCode) {
                case 65: // a
                    movementKeys.a = false;
                    break;
                case 68: // d
                    movementKeys.d = false;
                    break;
                case 87: // w
                    movementKeys.w = false;
                    break;
                case 83: // s
                    movementKeys.s = false;
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        };
    }, [isMovementBlocked]);

    useEffect(() => () => {
        game?.destructor();
    }, []);


    return (<div id={lobbyField} className={lobbyField}></div>)
}

export default LobbyCanvas;