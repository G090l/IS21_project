import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { ServerContext } from '../../App';
import CONFIG from '../../config';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';
import Game from '../../game/Game';
import Canvas from '../../services/canvas/Canvas';
import useCanvas from '../../services/canvas/useCanvas';
import Chat from '../../components/Chat/Chat';
import Shop from '../../components/Shop/Shop';
import useSprites from './hooks/useSprites';

const GAME_FIELD = 'game-field';

enum EAttackMode {
    SWORD = 'sword',
    BOW = 'bow'
}

const GamePage: React.FC<IBasePage> = (props: IBasePage) => {
    const server = useContext(ServerContext);
    const { WINDOW, SPRITE_SIZE } = CONFIG;
    const { setPage } = props;
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isShopOpen, setIsShopOpen] = useState(false);
    const gameRef = useRef<Game | null>(null);
    const canvasRef = useRef<Canvas | null>(null);
    const animationFrameRef = useRef<number>(0);
    const attackModeRef = useRef<EAttackMode>(EAttackMode.SWORD);

    // инициализация карты спрайтов
    const [
        [spritesImage],
        getSprite,
    ] = useSprites();

    const keysPressedRef = useRef({
        w: false,
        a: false,
        s: false,
        d: false
    });

    // Функция для отрисовки
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
    function printSprite(canvas: Canvas, { x = 0, y = 0 }, points: number[]): void {
        printFillSprite(spritesImage, canvas, { x, y }, points);
    }

    // Использование функции render:
    const render = (FPS: number): void => {
        if (canvasRef.current && gameRef.current) {
            canvasRef.current.clear();
            const scene = gameRef.current.getScene();
            const { heroes, walls, arrows, enemies } = scene;

            // Рисуем стены
            walls.forEach(wall => {
                printGameObject(canvasRef.current!, {
                    x: wall.x,
                    y: wall.y,
                    width: wall.width,
                    height: wall.height
                }, 'brown');
            });

            // Рисуем всех героев
            heroes.forEach((hero, index) => {
                const color = index === 0 ? 'blue' : ['green', 'yellow', 'purple'][index % 3];
                printGameObject(canvasRef.current!, hero.rect, color);
                printSprite(canvasRef.current!, { x: hero.rect.x, y: hero.rect.y }, getSprite(1));

                // Подписываем имя героя
                canvasRef.current!.text(hero.rect.x, hero.rect.y - 20, hero.name || "Неизвестно", 'white');

                // Рисуем меч
                if (hero.isAttacking && attackModeRef.current === EAttackMode.SWORD) {
                    const attackPosition = hero.getAttackPosition();
                    if (attackPosition) {
                        printGameObject(canvasRef.current!, attackPosition, 'red');
                        printSprite(canvasRef.current!, { x: attackPosition.x, y: attackPosition.y }, getSprite(1));
                    }
                }
            });

            // Рисуем врагов
            enemies.forEach(enemy => {
                printGameObject(canvasRef.current!, enemy.rect, 'red');
                printSprite(canvasRef.current!, { x: enemy.rect.x, y: enemy.rect.y }, getSprite(1));

                // Рисуем атаку врага
                if (enemy.getIsAttacking()) {
                    const attackPosition = enemy.getAttackPosition();
                    if (attackPosition) {
                        printGameObject(canvasRef.current!, attackPosition, 'orange');
                        printSprite(canvasRef.current!, { x: attackPosition.x, y: attackPosition.y }, getSprite(1));
                    }
                }
            });

            // Рисуем стрелы
            arrows.forEach(arrow => {
                printGameObject(canvasRef.current!, {
                    x: arrow.rect.x,
                    y: arrow.rect.y,
                    width: arrow.rect.width,
                    height: arrow.rect.height
                }, "red");
            });

            // Рисуем FPS
            canvasRef.current.text(WINDOW.LEFT + 20, WINDOW.TOP + 50, String(FPS), 'green');

            canvasRef.current.render();
        }
    };

    const CanvasComponent = useCanvas(render);

    const backClickHandler = () => {
        setPage(PAGES.LOBBY);
    };

    const mouseClick = useCallback(() => {
        if (attackModeRef.current === EAttackMode.SWORD) {
            gameRef.current?.handleSwordAttack();
        } else if (attackModeRef.current === EAttackMode.BOW) {
            gameRef.current?.addArrow();
        }
    }, []);

    const mouseRightClick = () => {
    };

    const handleMovement = useCallback(() => {
        const { w, a, s, d } = keysPressedRef.current;

        let dx = 0;
        let dy = 0;

        if (a) dx -= 1;
        if (d) dx += 1;
        if (w) dy -= 1;
        if (s) dy += 1;

        if (gameRef.current) {
            gameRef.current.updateCurrentUserMovement(dx, dy);
        }
    }, []);

    // Функция для переключения магазина
    const toggleShop = () => {
        setIsShopOpen(prev => !prev);
    };

    const changeAttackMode = (mode: EAttackMode) => {
        attackModeRef.current = mode;
    };

    useEffect(() => {
        // Инициализация игры
        gameRef.current = new Game(server);

        // Инициализация канваса
        canvasRef.current = CanvasComponent({
            parentId: GAME_FIELD,
            WIDTH: WINDOW.WIDTH,
            HEIGHT: WINDOW.HEIGHT,
            WINDOW,
            callbacks: {
                mouseMove: () => { },
                mouseClick,
                mouseRightClick,
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
                case 77: // m 
                    toggleShop();
                    break;
                case 49: // 1
                    changeAttackMode(EAttackMode.SWORD);
                    break;
                case 50: // 2
                    changeAttackMode(EAttackMode.BOW);
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

        const mouseDownHandler = (event: MouseEvent) => {
            if (event.button === 2) {
                event.preventDefault();
                gameRef.current?.handleBlock();
            }
        };

        const mouseUpHandler = (event: MouseEvent) => {
            if (event.button === 2) {
                gameRef.current?.handleUnblock();
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
    }, []);

    return (
        <div className='game'>
            <h1>Игра</h1>
            <div className="game-controls">
                <Button onClick={backClickHandler} text='Назад' />
            </div>
            <div className="debug-info">
                <p>Управление: WASD - движение, ЛКМ - атака, ПКМ - блок, 1 - меч, 2 - лук, M - магазин</p>
            </div>
            <div id={GAME_FIELD} className={GAME_FIELD}></div>
            <Chat
                isOpen={isChatOpen}
                onToggle={setIsChatOpen}
            />
            <Shop
                isOpen={isShopOpen}
                onToggle={setIsShopOpen}
            />
        </div>
    );
};

export default GamePage;