import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { ServerContext, StoreContext } from '../../../App';
import { IBasePage, PAGES } from '../../PageManager'
import Button from '../../../components/Button/Button';
import './LobbyManager.scss'


interface ILobbyManagerProps extends IBasePage {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
}


const LobbyManager: React.FC<ILobbyManagerProps> = (props) => {
    const { setPage, isOpen, onToggle } = props;
    const server = useContext(ServerContext);

    const toggleLobbyManager = () => {
        onToggle(!isOpen);
    };

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

    return (<div
        className={cn('lobby-manager', { 'lobby-manager-open': isOpen })}
    >

        <div className="lobby-manager-toggle" onClick={toggleLobbyManager}>
            {isOpen ? '☰' : '☰'}
        </div>

        {isOpen && (
            <div className="lobby-manager-window">
                <Button onClick={deleteUserClickHandler} text='Удалить аккаунт' />
                <Button onClick={exitAccountClickHandler} text='Выйти из аккаунта' />
            </div>
        )}

    </div>)
}

export default LobbyManager;