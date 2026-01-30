import React, { useContext, useEffect, useState } from "react";
import { ServerContext, StoreContext } from "../../../App";
import Button from "../../../components/Button/Button";
import { PAGES } from "../../PageManager";
import Chat from "../../../components/Chat/Chat";
import LobbyBook from "../LobbyBook/LobbyBook";
import ClassShop from "../ClassShop/ClassShop";
import LobbyGame from "../../../lobby/LobbyGame";

type TLobbyMenu = {
    game: LobbyGame;
    openLobbyBook: () => void;
    openClassShop: () => void;
    closeLobbyBook: () => void;
    closeClassShop: () => void;
    isLobbyBookOpen: boolean;
    isClassShopOpen: boolean;
    setPage: (page: PAGES) => void;
};

const zones = {
    start: { x1: 814, x2: 1105, y1: 685, y2: 770 },
    shop: { x1: 1455, x2: 1821, y1: 866, y2: 951 }
};

const isHeroInZone = (hero: any, zone: typeof zones[keyof typeof zones]) =>
    hero.rect.x > zone.x1 &&
    hero.rect.x < zone.x2 &&
    hero.rect.y > zone.y1 &&
    hero.rect.y < zone.y2;

const LobbyMenu: React.FC<TLobbyMenu> = (props: TLobbyMenu) => {
    const { game, openLobbyBook, openClassShop, closeLobbyBook, closeClassShop, isLobbyBookOpen, isClassShopOpen, setPage } = props;
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showStartButton, setShowStartButton] = useState(false);
    const [showShopButton, setShowShopButton] = useState(false);
    const user = store.getUser();

    useEffect(() => {
        let rafId: number;

        const checkZones = () => {
            const scene = game.getScene();
            const hero = scene.heroes[0];

            if (!hero) return;

            setShowStartButton(isHeroInZone(hero, zones.start));
            setShowShopButton(isHeroInZone(hero, zones.shop));

            rafId = requestAnimationFrame(checkZones);
        };

        rafId = requestAnimationFrame(checkZones);

        return () => cancelAnimationFrame(rafId);
    }, [game]);

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
        <div className='overlay'>
            <p className='money'>{`${user?.money}`}</p>
        </div>
        <div className='buttons'>
            <Button
                onClick={deleteUserClickHandler}
                className='deleteUser-button'
            />
            <Button
                onClick={exitAccountClickHandler}
                className='exitAccount-button'
            />
        </div>
        {showStartButton && (
            <Button
                onClick={openLobbyBook}
                className="startGame-button"
            />
        )}
        {showShopButton && (
            <Button
                onClick={openClassShop}
                className="classShop-button"
            />
        )}
        {isLobbyBookOpen && (
            <LobbyBook
                setPage={setPage}
                isOpen={isLobbyBookOpen}
                onClose={closeLobbyBook}
            />
        )}
        {isClassShopOpen && (
            <ClassShop
                setPage={setPage}
                isOpen={isClassShopOpen}
                onClose={closeClassShop}
            />
        )}
        <Chat
            isOpen={isChatOpen}
            onToggle={setIsChatOpen}
        />
    </>);
}

export default LobbyMenu;