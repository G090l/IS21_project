import React, { useState } from 'react';

import Login from './Login/Login';
import GamePage from './Game/Game';
import NotFound from './NotFound/NotFound';
import Lobby from './Lobby/Lobby';
import Registration from './Registration/Registration';
import ClassShop from './ClassShop/ClassShop';
import { TRoom } from '../services/server/types';


export enum PAGES {
    LOGIN,
    GAME,
    NOT_FOUND,
    LOBBY,
    REGISTRATION,
    CLASS_SHOP,
}

export interface IBasePage {
    setPage: (name: PAGES) => void;
    room?: TRoom;
}

const PageManager: React.FC = () => {
    const [page, setPage] = useState<PAGES>(PAGES.LOGIN);

    return (
        <>
            {page === PAGES.LOGIN && <Login setPage={setPage} />}
            {page === PAGES.GAME && <GamePage setPage={setPage} />}
            {page === PAGES.NOT_FOUND && <NotFound setPage={setPage} />}
            {page === PAGES.LOBBY && <Lobby setPage={setPage} />}
            {page === PAGES.REGISTRATION && <Registration setPage={setPage} />}
            {page === PAGES.CLASS_SHOP && <ClassShop setPage={setPage} />}
        </>
    );
}

export default PageManager;