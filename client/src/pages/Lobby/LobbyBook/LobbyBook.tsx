import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { ServerContext, StoreContext } from '../../../App';
import Button from '../../../components/Button/Button';
import { IBasePage, PAGES } from '../../PageManager';
import { TError, TRoom } from '../../../services/server/types';
import './LobbyBook.scss';

interface ILobbyBook extends IBasePage {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
}

const LobbyBook: React.FC<ILobbyBook> = (props) => {
    const { setPage, isOpen, onToggle } = props
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [activeSection, setActiveSection] = useState<'create' | 'join'>('create');
    const [error, setError] = useState<string | null>(null);
    const [roomName, setRoomName] = useState('');
    const [roomSize, setRoomSize] = useState(1);
    const [rooms, setRooms] = useState<TRoom[]>([]);


    useEffect(() => {
        server.showError((err: TError) => {
            if ([2001, 2002, 2003, 2004, 2005].includes(err.code)) {
                setError(err.text);
            }
        });
    }, []);

    useEffect(() => {
        setRooms(store.getRooms());
    }, [store.rooms]);

    useEffect(() => {
        if (activeSection === 'join' && isOpen) {
            const loadRooms = async () => {
                await server.getRoomsAndMembers();
                setRooms(store.getRooms());
            };
            loadRooms();

            const handleRoomsUpdate = () => {
                setRooms(store.getRooms());
            };

            server.startGettingRooms(handleRoomsUpdate);
            return () => server.stopGettingRooms();
        }
    }, [activeSection, isOpen]);

    const createRoomClickHandler = async () => {
        const success = await server.createRoom(roomName, roomSize);
        if (success && success.room) {
            setPage(PAGES.LOBBY);
            onToggle(false);
        }
    }

    const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(e.target.value);
    }
    const roomSizeClickHandler = (count: number) => {
        setRoomSize(count);
    }

    const joinToRoomClickHandler = async (roomId: number) => {
        const success = await server.joinToRoom(roomId);
        if (success) {
            const room = rooms.find(r => r.id === roomId);
            if (room) {
                store.setCurrentRoom(room);
            }
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
                        <div className='roomSize-buttons'>
                            {[1, 2, 3, 4, 5, 6].map(count => (
                                <Button
                                    key={count}
                                    onClick={() => roomSizeClickHandler(count)}
                                    className={cn('roomSize-button',
                                        `btn-${count}`,
                                        { 'active': roomSize === count }
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
                            {rooms.filter(room => room.status === 'open').map(room => (
                                <Button
                                    key={room.id}
                                    onClick={() => joinToRoomClickHandler(room.id)}
                                    className="room-item"
                                    text={`Комната ${room.name}\nИгроков: ${room.players_count}/${room.room_size}`}
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

export default LobbyBook;