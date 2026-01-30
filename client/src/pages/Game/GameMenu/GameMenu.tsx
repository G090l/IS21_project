import React, { useContext, useState } from "react";
import { ServerContext, StoreContext } from "../../../App";
import { IBasePage, PAGES } from "../../PageManager";
import Button from "../../../components/Button/Button";
import Chat from "../../../components/Chat/Chat";
import ItemShop from "../ItemShop/ItemShop";

type TGameMenu = {
    isItemShopOpen: boolean;
    setPage: (page: PAGES) => void;
};

const GameMenu: React.FC<TGameMenu> = (props: TGameMenu) => {
    const { setPage, isItemShopOpen } = props;
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const user = store.getUser();


    const leaveRoomClickHandler = () => {
        server.leaveRoom()
        setPage(PAGES.LOBBY);
    };

    return (<>
    <div className='overlay'>
            <p className='money'>{`${user?.money}`}</p>
        </div>
        <Button onClick={leaveRoomClickHandler} text='Покинуть игру' />
        <Chat
            isOpen={isChatOpen}
            onToggle={setIsChatOpen}
        />
        {isItemShopOpen && (
            <ItemShop
                isOpen={isItemShopOpen}
            />
        )}
    </>);
}

export default GameMenu;