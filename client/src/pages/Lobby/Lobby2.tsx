import React, { useEffect, useState, useContext } from 'react';
import cn from 'classnames';
import { ServerContext, StoreContext } from '../../App';
import CONFIG from '../../config';
import { TError, TRoom } from '../../services/server/types';
import { IBasePage, PAGES } from '../PageManager';

import Button from '../../components/Button/Button';
import Chat from '../../components/Chat/Chat';
import './Lobby2.scss';

const Lobby2: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [rooms, setRooms] = useState<TRoom[]>([]);
    const [_, setHash] = useState<string>('');
    const user = store.getUser();
    const room = store.getCurrentRoom();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [roomName, setRoomName] = useState('');
    const [roomSize, setRoomSize] = useState(1);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const roomMembers = store.getRoomMembers();

    const owner = roomMembers.find(member => member.type === 'owner');
    const isOwner = user?.id === owner?.user_id;

    useEffect(() => {
        const loadRoom = async () => {
            if (!room) {
                const userRoom = await server.getUserRoom();
                if (userRoom) store.setCurrentRoom(userRoom);
            }
        };
        loadRoom();
    }, []);

    useEffect(() => {
        server.showError((err: TError) => {
            setError(err.text);

        });
    }, []);

    useEffect(() => {
        const roomsUpdate = (hash: string) => {
            const currentRooms = store.getRooms();
            setRooms(currentRooms);
            setHash(hash);
        }

        if (user) {
            server.startGettingRooms(roomsUpdate);
        }

        return () => {
            server.stopGettingRooms();
        }
    });

    const createRoomClickHandler = async () => {
        await server.createRoom(roomName, roomSize);

    }

    const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(e.target.value);
    }
    const roomSizeClickHandler = (count: number) => {
        setRoomSize(count);
    }

    const renameRoomClickHandler = async () => {
        if (newRoomName && room) {
            const success = await server.renameRoom(newRoomName);
            if (success) {
                setIsRenaming(false);
                setNewRoomName('');
            }
        }
        setIsRenaming(false);
    };

    const joinToRoomClickHandler = async (roomId: number) => {
        const success = await server.joinToRoom(roomId);
        if (success) {
            const room = rooms.find(r => r.id === roomId);
            if (room) {
                store.setCurrentRoom(room);

            }
        }
    }

    const leaveRoomClickHandler = async () => {
        await server.leaveRoom();
    }

    const dropFromRoomClickHandler = async (targetToken: string) => {
        const success = await server.dropFromRoom(targetToken);
        if (success) {
            const roomsResponse = await server.getRoomsAndMembers();
            if (roomsResponse?.rooms) {
                setRooms(roomsResponse.rooms);
            }
        }
    }
    const startGameClickHandler = async () => {
        const success = await server.startGame();
        if (success) {
            setPage(PAGES.GAME);
        }
    }

    return (
        <div className='lobby2'>
            <div className="create-join">
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
                            text={String(count)}
                            className={cn('roomSize-button',
                                `btn-${count}`,
                                { 'active': roomSize === count }
                            )}
                        />
                    ))}
                </div>

                <Button
                    onClick={createRoomClickHandler}
                    text='create room'
                    className='createRoom-button'
                />

                <div className='error-section'>
                    {error && (
                        <div className="error-message">
                            <span>{error}</span>
                        </div>
                    )}
                </div>
                <div className="rooms">
                    {rooms.filter(room => room.status === 'open').map(room => (
                        <Button
                            key={room.id}
                            onClick={() => joinToRoomClickHandler(room.id)}
                            className="room-item"
                            text={`Комната ${room.name}\nИгроков: ${room.players_count}/${room.room_size}`}
                        />
                    ))}
                </div>
            </div>

            <div className="room-info">
                {!room ? (
                    <div className="no-room-message">Комната не выбрана</div>
                ) : (
                    <>
                        <div className="room-name-section">
                            {isRenaming ? (
                                <>
                                    <input
                                        value={newRoomName}
                                        onChange={(e) => setNewRoomName(e.target.value)}
                                        autoFocus
                                        className="rename-input"
                                        maxLength={20}
                                    />
                                    <Button
                                        text="✓"
                                        onClick={renameRoomClickHandler}
                                        className="confirm-rename-button"
                                    />
                                </>
                            ) : (
                                <>
                                    <span className="room-name">{room.name}</span>
                                    {isOwner && (
                                        <Button
                                            text="Переименовать"
                                            onClick={() => {
                                                setIsRenaming(true);
                                                setNewRoomName(room.name);
                                            }}
                                            className="rename-button"
                                        />
                                    )}
                                </>
                            )}
                        </div>

                        <div className="room-members">
                            <div className="players-count">
                                Игроков: {room.players_count}/{room.room_size}
                            </div>
                            {roomMembers.map(member => (
                                <div key={member.user_id} className="user-item">
                                    <div className="user-info">
                                        <div className="member-name">
                                            {member.nickname}
                                            {member.type === 'owner' && (
                                                <span className="host"> - хост</span>
                                            )}
                                        </div>
                                    </div>
                                    {isOwner && user?.id !== member.user_id && (
                                        <div className="user-actions">
                                            <Button
                                                className="dropFromRoom-button"
                                                text="Кикнуть"
                                                onClick={() => dropFromRoomClickHandler(member.token)}
                                            />
                                        </div>

                                    )}
                                </div>
                            ))}
                            {isOwner && (
                                <Button onClick={startGameClickHandler} text='Начать игру' />
                            )}
                            <Button onClick={leaveRoomClickHandler} text='leave room' />
                        </div>
                    </>
                )}
            </div>

            <Chat
                isOpen={isChatOpen}
                onToggle={setIsChatOpen}
            />

        </div>
    );
}

export default Lobby2;