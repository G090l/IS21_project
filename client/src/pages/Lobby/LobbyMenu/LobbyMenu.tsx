import React, { useContext, useState } from "react";
import { ServerContext } from "../../../App";
import Button from "../../../components/Button/Button";
import { IBasePage, PAGES } from "../../PageManager";
import Chat from "../../../components/Chat/Chat";
import LobbyBook from "../LobbyBook/LobbyBook";
import ClassShop from "../ClassShop/ClassShop";


const LobbyMenu: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;
    const server = useContext(ServerContext);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const deleteUserClickHandler = async () => {
        const success = await server.deleteUser();
        if (success) {
            setPage(PAGES.LOGIN);
        }
    }

    const exitAccountClickHandler = async () => {
        await server.leaveRoom();
        await server.logout();
        setPage(PAGES.LOGIN);
    };

    return (<>
        <div className='buttons'>
            <Button
                onClick={deleteUserClickHandler}
                className='deleteUser-button'
                text='Удалить аккаунт'
            />
            <Button
                onClick={exitAccountClickHandler}
                className='exitAccount-button'
                text='Выйти из аккаунта'
            />
        </div>
        <Chat
            isOpen={isChatOpen}
            onToggle={setIsChatOpen}
        />
    </>);
}

export default LobbyMenu;