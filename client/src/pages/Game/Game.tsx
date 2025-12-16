import React from 'react';
import { IBasePage} from '../PageManager';
import GameCanvas from './GameCanvas/GameCanvas';
import GameMenu from './GameMenu/GameMenu';
import './Game.scss';


const GamePage: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;

    return (
        <div className='game'>
            <div className="canvas-container">
                <h1>Игра</h1>
                <div className="debug-info">
                    <p>Управление: WASD - движение, ЛКМ - атака, ПКМ - блок, 1 - меч, 2 - лук, M - магазин</p>
                </div>
                <GameCanvas />
            </div>
            <GameMenu
                setPage={setPage}
            />
        </div>
    );
};

export default GamePage;