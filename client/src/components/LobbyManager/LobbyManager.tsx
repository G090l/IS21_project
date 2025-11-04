import React, { useContext, useState } from 'react';
import { ServerContext, StoreContext } from '../../App';
import Button from '../Button/Button';
import { IBasePage, PAGES } from '../../pages/PageManager';
import './LobbyManager.scss'
import { TRoom } from '../../services/server/types';

interface ILobbyManagerProps extends IBasePage {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
}


const LobbyManager: React.FC<ILobbyManagerProps> = (props) => {
    const { setPage, isOpen, onToggle } = props;
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [currentRoom, setCurrentRoom] = useState<number | null>(null);
    const [rooms, setRooms] = useState<TRoom[]>([]);

    const toggleLobbyManager = () => {
        onToggle(!isOpen);
    };

    const createRoomClickHandler = async () => {
        const success = await server.createRoom();
        if (success) {
            setPage(PAGES.LOBBY);
        }
    }

    const joinToRoomClickHandler = async (roomId: number) => {
        const success = await server.joinToRoom(roomId);
        if (success) {
            setCurrentRoom(roomId);
            setPage(PAGES.LOBBY);
        }
    }

    const leaveRoomClickHandler = async () => {
        const success = await server.leaveRoom();
        if (success) {
            setCurrentRoom(null);
            setPage(PAGES.LOBBY);
        }
    }

    const dropFromRoomClickHandler = async (targetToken: string) => {
        await server.dropFromRoom(targetToken);
    }

    const deleteUserClickHandler = async () => {
        const success = await server.deleteUser();
        if (success) {
            setPage(PAGES.LOGIN);
        }
    }

    const startGameClickHandler = async () => {
        const success = await server.startGame();
        if (success) {
            setPage(PAGES.GAME);
        }
    }

    const getRoomsClickHandler = async () => {
        await server.getRooms();
    }

    const exitAccountClickHandler = async () => {
        await server.leaveRoom();
        await server.logout();
        setPage(PAGES.LOGIN);
    };

    return (<div
        className={`lobby-manager ${isOpen ? 'lobby-manager-open' : ''}`}
    >

        <div className="lobby-manager-toggle" onClick={toggleLobbyManager}>
            {isOpen ? '☰' : '☰'}
        </div>

        {isOpen && (
            <div className="lobby-manager-window">
                <Button onClick={createRoomClickHandler} text='Создать комнату' />
                <Button onClick={joinToRoomClickHandler} text='Присоединиться к комнате' />
                <Button onClick={leaveRoomClickHandler} text='Покинуть комнату' />
                <Button onClick={dropFromRoomClickHandler} text='Выгнать из комнаты' />
                <Button onClick={deleteUserClickHandler} text='Удалить аккаунт' />
                <Button onClick={startGameClickHandler} text='Начать игру' />
                <Button onClick={getRoomsClickHandler} text='Получить комнаты' />
                <Button onClick={exitAccountClickHandler} text='Выйти из аккаунта' />
            </div>
        )}

    </div>)
}

export default LobbyManager;