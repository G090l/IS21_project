import React, { useState } from "react";
import Chat from "../../../components/Chat/Chat";
import Shop from "../../../components/Shop/Shop";

const GameMenu: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isShopOpen, setIsShopOpen] = useState(false);

    // Функция для переключения магазина
    const toggleShop = () => {
        setIsShopOpen(prev => !prev);
    };

    return (<>
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