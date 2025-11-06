import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { ServerContext, StoreContext } from '../../App';
import Button from '../Button/Button';
import { IBasePage, PAGES } from '../../pages/PageManager';
import './StartingGameMenu.scss';
import { TError, TRooms } from '../../services/server/types';

interface IStartingGameMenu extends IBasePage {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
}

const StartingGameMenu: React.FC<IStartingGameMenu> = (props) => {
    const { setPage, isOpen, onToggle } = props
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [currentRoom, setCurrentRoom] = useState<number | null>(null);
    const [activeSection, setActiveSection] = useState<'create' | 'join'>('create');
    const [error, setError] = useState<string | null>(null);
    const [roomName, setRoomName] = useState('');
    const [playersCount, setPlayersCount] = useState(1);
    const [rooms, setRooms] = useState<TRooms>([]);


    useEffect(() => {
        server.showError((err: TError) => {
            if (err.code === 2004 || err.code === 2005) {
                setError('Вы участвуете в другом лобби.');
            } else if (err.code === 2006) {
                setError('Действие недоступно во время активной игры.');
            } else if (err.code === 2007) {
                setError('Лобби переполнено.');
            } else if (err.code === 2003) {
                setError('Лобби Этого лобби не существует.');
            }
        });
    }, []);

    useEffect(() => {
        setRooms(store.rooms);
    }, [store.rooms]);

    useEffect(() => {
        if (activeSection === 'join' && isOpen) {
            const loadRooms = async () => {
                await server.getRooms();
                setRooms(store.rooms);
            };
            loadRooms();

            const handleRoomsUpdate = () => {
                setRooms(store.rooms);
            };

            server.startGettingRooms(handleRoomsUpdate);
            return () => server.stopGettingRooms();
        }
    }, [activeSection, isOpen]);

    const createRoomClickHandler = async () => {
        const success = await server.createRoom(roomName);
        if (success) {
            setPage(PAGES.LOBBY);
            onToggle(false);
        }
    }

    const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(e.target.value);
    }
    const handlePlayersCountClick = (count: number) => {
        setPlayersCount(count);
    }

    const joinToRoomClickHandler = async (roomId: number) => {
        const success = await server.joinToRoom(roomId);
        if (success) {
            setCurrentRoom(roomId);
            setPage(PAGES.LOBBY);
        }
    }

    const backClickHandler = () => {
        onToggle(false);
    };

    const renderRightSection = () => {
        switch (activeSection) {
            case 'create':
                return (
                    <div className="right-section">
                        <input
                            placeholder='Название комнаты'
                            className='nameRoom-input'
                            value={roomName}
                            onChange={handleRoomNameChange}
                        />
                        <div className='playersCount-buttons'>
                            {[1, 2, 3, 4, 5, 6].map(count => (
                                <Button
                                    key={count}
                                    onClick={() => handlePlayersCountClick(count)}
                                    className={cn('playerCount-button',
                                        `btn-${count}`,
                                        { 'active': playersCount === count }
                                    )}
                                />
                            ))}
                        </div>
                        <Button
                            onClick={createRoomClickHandler}
                            className='createRoom-button'
                        />
                        <Button
                            onClick={backClickHandler}
                            className='back-button'
                        />
                    </div>
                );

            case 'join':
                return (
                    <div className="right-section">
                        <div className="room-section">
                            {rooms.map(room => (
                                <Button
                                    key={room.id}
                                    onClick={() => joinToRoomClickHandler(room.id)}
                                    className="room-item"
                                    text={`Комната ${room.name}\nИгроков: ${room.players_count}/${playersCount}`}
                                />
                            ))}
                        </div>
                        <Button
                            onClick={backClickHandler}
                            className='back-button'
                        />
                    </div >
                );
        }
    };

    return (<div
        className={cn('starting-game-menu', { 'starting-game-menu-open': isOpen })}
    >
        <div className='starting-game-menu-window'>
            <div className='left-section'>
                <Button
                    onClick={() => setActiveSection('create')}
                    className={cn('createSection-button', {
                        'active': activeSection === 'create'
                    })}
                />
                <Button
                    onClick={() => setActiveSection('join')}
                    className={cn('joinSection-button', {
                        'active': activeSection === 'join'
                    })}
                />
                <div className='error-section'>
                    {error && (
                        <div className="error-message">
                            <span>{error}</span>
                        </div>
                    )}
                </div>

            </div>
            {renderRightSection()}
        </div>

    </div>
    )
}

export default StartingGameMenu;