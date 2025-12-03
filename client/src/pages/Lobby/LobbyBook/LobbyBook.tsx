import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { ServerContext, StoreContext } from '../../../App';
import Button from '../../../components/Button/Button';
import { IBasePage, PAGES } from '../../PageManager';
import { TError, TRoom } from '../../../services/server/types';
import './LobbyBook.scss';
import Room from '../Room/Room';
import RoomInfo from '../RoomInfo/RoomInfo';

interface ILobbyBook extends IBasePage {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
}

const LobbyBook: React.FC<ILobbyBook> = (props) => {
    const { setPage, isOpen, onToggle } = props
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [rooms, setRooms] = useState<TRoom[]>([]);
    const [_, setHash] = useState<string>('');
    const refRoomName = useRef<HTMLInputElement>(null!);
    const [roomSize, setRoomSize] = useState(1);
    const user = store.getUser();
    const [activeSection, setActiveSection] = useState<'create' | 'join'>('create');
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        server.showError((err: TError) => {
            setError(err.text);
        });
    }, []);

    useEffect(() => {
        const roomsUpdate = (hash: string) => {
            setRooms(store.getRooms());
            setHash(hash);
        }

        if (user) {
            server.startGettingRooms(roomsUpdate);
        }

        return () => {
            server.stopGettingRooms();
        }
    });

    const createRoomClickHandler = () => {
        const name = refRoomName.current.value;
        if (name && roomSize) {
            server.createRoom(name, roomSize);
        }
    }

    const roomSizeClickHandler = (count: number) => {
        setRoomSize(count);
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
                            ref={refRoomName}
                            placeholder='Название комнаты'
                            className='nameRoom-input'
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
                            {rooms.length > 0 ? (
                                rooms.map(room => (
                                    <Room
                                        key={room.id}
                                        room={room}
                                    />
                                ))
                            ) : (
                                <div className="no-rooms-message">
                                    Нет доступных комнат
                                </div>
                            )}
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
        className={cn('lobbyBook', { 'lobbyBook-open': isOpen })}
    >
        <div className='lobbyBook-window'>
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
                {rooms.map(room => (
                    <RoomInfo
                        room={room}
                        setPage={setPage}
                    />
                ))
                }
                < div className='error-section'>
                    {error && (
                        <div className="error-message">
                            <span>{error}</span>
                        </div>
                    )}
                </div>

            </div>
            {renderRightSection()}
        </div>

    </div >
    )
}

export default LobbyBook;