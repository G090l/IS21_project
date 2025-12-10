import React from 'react';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';

import GameCanvas from './GameCanvas/GameCanvas';
import GameMenu from './GameMenu/GameMenu';

const GamePage: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;
    const backClickHandler = () => setPage(PAGES.LOBBY);

    return (
        <div className='game'>
            <h1>Игра</h1>
            <div className="game-controls">
                <Button onClick={backClickHandler} text='Назад' />
            </div>
            <div className="debug-info">
                <p>Управление: WASD - движение, ЛКМ - атака, ПКМ - блок, 1 - меч, 2 - лук, M - магазин</p>
            </div>
            <GameCanvas />
            <GameMenu />
        </div>
    );
};

export default GamePage;