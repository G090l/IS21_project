import React, { useEffect, useContext } from 'react';
import { ServerContext } from '../../App';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';
import Game from '../../game/Game';

import GameCanvas from './GameCanvas/GameCanvas';
import GameMenu from './GameMenu/GameMenu';

const GamePage: React.FC<IBasePage> = (props: IBasePage) => {
    const server = useContext(ServerContext);
    const { setPage } = props;
    const game = new Game(server);

    const backClickHandler = () => setPage(PAGES.LOBBY);

    // выстреливает только при уничтожении компоненты
    useEffect(() => () => game.destructor());

    return (
        <div className='game'>
            <h1>Игра</h1>
            <div className="game-controls">
                <Button onClick={backClickHandler} text='Назад' />
            </div>
            <div className="debug-info">
                <p>Управление: WASD - движение, ЛКМ - атака, ПКМ - блок, 1 - меч, 2 - лук, M - магазин</p>
            </div>
            <GameCanvas game={game} />
            <GameMenu />
        </div>
    );
};

export default GamePage;