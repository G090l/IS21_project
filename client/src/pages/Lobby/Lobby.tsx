import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { IBasePage, PAGES } from '../PageManager';
import LobbyGame from '../../lobby/LobbyGame';
import LobbyCanvas from './LobbyCanvas/LobbyCanvas';
import LobbyMenu from './LobbyMenu/LobbyMenu';
import './Lobby.scss';

const Lobby: React.FC<IBasePage> = ({ setPage }) => {
    const [game, setGame] = useState<LobbyGame | null>(null);
    const [isLobbyBookOpen, setIsLobbyBookOpen] = useState(false);
    const [isClassShopOpen, setIsClassShopOpen] = useState(false);
    const [isMovementBlocked, setIsMovementBlocked] = useState(false);


    const openLobbyBook = () => {
        setIsLobbyBookOpen(true);
        setIsMovementBlocked(true);
    };

    const closeLobbyBook = () => {
        setIsLobbyBookOpen(false);
        setIsMovementBlocked(false);
    };

    const openClassShop = () => {
        setIsClassShopOpen(true);
        setIsMovementBlocked(true);
    };

    const closeClassShop = () => {
        setIsClassShopOpen(false);
        setIsMovementBlocked(false);
    };

    return (<div className='lobby'>
        <div className="canvas-container">
            {game && (
                <LobbyMenu
                    game={game}
                    openLobbyBook={openLobbyBook}
                    closeLobbyBook={closeLobbyBook}
                    openClassShop={openClassShop}
                    closeClassShop={closeClassShop}
                    isLobbyBookOpen={isLobbyBookOpen}
                    isClassShopOpen={isClassShopOpen}
                    setPage={setPage}
                />
            )}
            <LobbyCanvas
                setPage={setPage}
                setGame={setGame}
                openLobbyBook={openLobbyBook}
                openClassShop={openClassShop}
                isMovementBlocked={isMovementBlocked}
            />
        </div>
    </div>)
}

export default Lobby;