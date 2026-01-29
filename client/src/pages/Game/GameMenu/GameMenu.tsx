import React, { useContext, useState } from "react";
import { ServerContext } from "../../../App";
import { IBasePage, PAGES } from "../../PageManager";
import Button from "../../../components/Button/Button";
import Chat from "../../../components/Chat/Chat";
import Shop from "../../../components/Shop/Shop";


const GameMenu: React.FC<IBasePage> = (props: IBasePage) => {
    const server = useContext(ServerContext);

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isShopOpen, setIsShopOpen] = useState(false);

    // Функция для переключения магазина
    const toggleShop = () => {
        setIsShopOpen(prev => !prev);
    };

    const { setPage } = props;
    const leaveRoomClickHandler = () => {
        server.leaveRoom()
        setPage(PAGES.LOBBY);
    };

    return (<>
        <Button onClick={leaveRoomClickHandler} text='Покинуть игру' />

        <Chat
            isOpen={isChatOpen}
            onToggle={setIsChatOpen}
        />
        <Shop
            isOpen={isShopOpen}
            onToggle={setIsShopOpen}
        />
    </>);
}

export default GameMenu;