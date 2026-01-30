import React, { useState } from 'react';
import { IBasePage } from '../PageManager';
import GameCanvas from './GameCanvas/GameCanvas';
import GameMenu from './GameMenu/GameMenu';
import './Game.scss';


const GamePage: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;

    const [isItemShopOpen, setIsItemShopOpen] = useState(false);

    return (
        <div className='game'>
            <div className="canvas-container">
                <h1>Игра</h1>
                <div className="debug-info">
                    <p>Управление: WASD - движение, ЛКМ - атака, ПКМ - блок, 1 - меч, 2 - лук</p>
                </div>
                <GameMenu
                    setPage={setPage}
                    isItemShopOpen={isItemShopOpen}
                />
                <GameCanvas
                    onOpenItemShop={() => setIsItemShopOpen(true)}
                    onCloseItemShop={() => setIsItemShopOpen(false)}
                />
            </div>
        </div>
    );
};

export default GamePage;