import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { ServerContext, StoreContext } from '../../App';
import CONFIG from '../../config';
import Canvas from '../../services/canvas/Canvas';
import useCanvas from '../../services/canvas/useCanvas';
import { IBasePage, PAGES } from '../PageManager';
import LobbyGame from '../../lobby/LobbyGame';
import useSprites from '../../pages/Game/hooks/useSprites';
import Button from '../../components/Button/Button';
import Chat from '../../components/Chat/Chat';
import LobbyManager from './LobbyManager/LobbyManager';
import LobbyBook from './LobbyBook/LobbyBook';
import RoomInfo from './RoomInfo/RoomInfo';

import menuBackground from '../../assets/img/lobby/menu-background.png';
import lobbyBackground from '../../assets/img/lobby/lobby-background.png';
import './Lobby.scss';

const LOBBY_FIELD = 'lobby-field';
const HERO_WALK_SPRITES = [2, 3, 4, 5, 6, 7, 8];

const Lobby: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const { WINDOW, SPRITE_SIZE } = CONFIG;
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isLobbyManagerOpen, setIsLobbyManagerOpen] = useState(false);
    const [isLobbyBookOpen, setIsLobbyBookOpen] = useState(false);
    const gameRef = useRef<LobbyGame | null>(null);
    const canvasRef = useRef<Canvas | null>(null);
    const animationFrameRef = useRef<number>(0);
    const backgroundImageRef = useRef<HTMLImageElement>(new Image());
    const [showStartButton, setShowStartButton] = useState(false);
    const [showShopButton, setShowShopButton] = useState(false);
    const isMovingRef = useRef<boolean>(false);

    // инициализация карты спрайтов
    const [
        [spritesImage],
        getSprite,
        animationFunctions
    ] = useSprites({
        hero_walk: HERO_WALK_SPRITES,
    });

    const keysPressedRef = useRef({
        w: false,
        a: false,
        s: false,
        d: false
    });

    // Функция для отрисовки
    function printGameObject(
        canvas: Canvas,
        { x = 0, y = 0, width = 100, height = 100 }: { x: number; y: number; width: number; height: number },
        color: string
    ): void {
        canvas.rectangle(x, y, width, height, color);
    }

    const background = store.getCurrentRoom() ? lobbyBackground : menuBackground;


    useEffect(() => {
        backgroundImageRef.current.src = background;
    }, [background]);

    function printFillSprite(image: HTMLImageElement, canvas: Canvas, { x = 0, y = 0 }, points: number[]): void {
        canvas.spriteFull(image, x, y, points[0], points[1], points[2]);
    }

    function printHeroSprite(canvas: Canvas, { x = 0, y = 0 }, isMoving: boolean = false): void {
        let spriteNumber = 1;

        if (isMoving) {
            spriteNumber = animationFunctions.hero_walk ? animationFunctions.hero_walk() : 1;
        }
        const [sx, sy, size] = getSprite(spriteNumber);
        printFillSprite(spritesImage, canvas, { x, y }, [sx, sy, size]);
    }

    // Использование функции render:
    const render = (FPS: number): void => {
        if (canvasRef.current && gameRef.current && backgroundImageRef.current) {
            canvasRef.current.clearImage(backgroundImageRef.current);
            const scene = gameRef.current.getScene();
            const { heroes, walls } = scene;
            scene.heroes.forEach(hero => {
                if (hero.rect.x > 814 && hero.rect.x < 1105 &&
                    hero.rect.y > 685 && hero.rect.y < 770) {
                    setShowStartButton(true);
                } else {
                    setShowStartButton(false);
                }

                if (hero.rect.x > 1455 && hero.rect.x < 1821 &&
                    hero.rect.y > 866 && hero.rect.y < 951) {
                    setShowShopButton(true);
                } else {
                    setShowShopButton(false);
                }
            });

            // Рисуем стены
            walls.forEach(wall => {
                printGameObject(canvasRef.current!, {
                    x: wall.x,
                    y: wall.y,
                    width: wall.width,
                    height: wall.height
                }, 'transparent');
            });
            const currentHero = heroes.find(hero => hero.name === server?.store.getUser()?.nickname) || heroes[0];
            const isHeroMoving = isMovingRef.current;

            // Рисуем всех героев
            heroes.forEach((hero, index) => {
                const color = index === 0 ? 'blue' : ['green', 'yellow', 'purple'][index % 3];
                printGameObject(canvasRef.current!, hero.rect, color);
                const shouldAnimateWalk = (hero === currentHero) ? isHeroMoving : false;
                printHeroSprite(canvasRef.current!, {
                    x: hero.rect.x - SPRITE_SIZE + hero.rect.width + 100,
                    y: hero.rect.y - SPRITE_SIZE + hero.rect.height + 10
                }, shouldAnimateWalk);

                // Подписываем имя героя
                canvasRef.current!.text(hero.rect.x, hero.rect.y - 20, hero.name || "Неизвестно", 'white');
            });

            // Рисуем FPS
            canvasRef.current.text(WINDOW.LEFT + 20, WINDOW.TOP + 50, String(FPS), 'green');

            canvasRef.current.render();
        }
    };

    const CanvasComponent = useCanvas(render);

    const handleMovement = useCallback(() => {
        const { w, a, s, d } = keysPressedRef.current;

        let dx = 0;
        let dy = 0;

        if (a) dx -= 1;
        if (d) dx += 1;
        if (w) dy -= 1;
        if (s) dy += 1;

        const isMovingNow = dx !== 0 || dy !== 0;

        if (isMovingNow !== isMovingRef.current) {
            isMovingRef.current = isMovingNow;
        }

        if (gameRef.current) {
            gameRef.current.updateCurrentUserMovement(dx, dy);
        }
    }, []);

    useEffect(() => {
        // Инициализация игры
        gameRef.current = new LobbyGame(server);

        const scene = gameRef.current.getScene();
        scene.heroes.forEach(hero => {
            hero.rect.x = 740;
            hero.rect.y = 800;
        });

        // Инициализация канваса
        canvasRef.current = CanvasComponent({
            parentId: LOBBY_FIELD,
            WIDTH: WINDOW.WIDTH,
            HEIGHT: WINDOW.HEIGHT,
            WINDOW,
            callbacks: {
                mouseMove: () => { },
                mouseClick: () => { },
                mouseRightClick: () => { },
            },
        });

        // Игровой цикл
        const gameLoop = () => {
            handleMovement();
            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        animationFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
            // Очистка ресурсов
            cancelAnimationFrame(animationFrameRef.current);
            gameRef.current?.destructor();
            canvasRef.current?.destructor();
            canvasRef.current = null;
            gameRef.current = null;
        };
    }, [handleMovement, WINDOW]);

    useEffect(() => {
        const keyDownHandler = (event: KeyboardEvent) => {
            const keyCode = event.keyCode ? event.keyCode : event.which ? event.which : 0;
            if (document.activeElement?.tagName === 'INPUT' && keyCode === 70) return;
            switch (keyCode) {
                case 65: // a
                    keysPressedRef.current.a = true;
                    break;
                case 68: // d
                    keysPressedRef.current.d = true;
                    break;
                case 87: // w
                    keysPressedRef.current.w = true;
                    break;
                case 83: // s
                    keysPressedRef.current.s = true;
                    break;
                case 70: // f
                    event.preventDefault();
                    if (showStartButton) {
                        toggleLobbyBook();
                    } else if (showShopButton) {
                        classShopClickHandler();
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
                    keysPressedRef.current.a = false;
                    break;
                case 68: // d
                    keysPressedRef.current.d = false;
                    break;
                case 87: // w
                    keysPressedRef.current.w = false;
                    break;
                case 83: // s
                    keysPressedRef.current.s = false;
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
    }, [showStartButton, showShopButton, isChatOpen]);


    const classShopClickHandler = () => {
        setPage(PAGES.CLASS_SHOP);
    };

    const toggleLobbyBook = () => {
        setIsLobbyBookOpen(true);
    };

    return (<div className='lobby'>
        <div className="canvas-container">
            {showStartButton && (
                <Button
                    onClick={toggleLobbyBook}
                    className='startGame-button'
                    id='test-menu-startGame-button'
                />
            )}
            {showShopButton && (
                <Button
                    onClick={classShopClickHandler}
                    className='classShop-button'
                    id='test-menu-classShop-button'
                />
            )}
            <LobbyManager
                setPage={setPage}
                isOpen={isLobbyManagerOpen}
                onToggle={setIsLobbyManagerOpen}
            />
            {isLobbyBookOpen && (
                <LobbyBook
                    setPage={setPage}
                    isOpen={isLobbyBookOpen}
                    onToggle={setIsLobbyBookOpen}
                />
            )}
            <div id={LOBBY_FIELD} className={LOBBY_FIELD}></div>
            <Chat
                isOpen={isChatOpen}
                onToggle={setIsChatOpen}
            />
            <RoomInfo />
        </div>
    </div>)
}

export default Lobby;