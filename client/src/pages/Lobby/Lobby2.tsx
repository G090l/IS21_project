import React, { useEffect, useState, useContext, useRef } from 'react';
import cn from 'classnames';
import { ServerContext, StoreContext } from '../../App';
import CONFIG from '../../config';
import { TError, TRoom } from '../../services/server/types';
import { IBasePage, PAGES } from '../PageManager';

import Button from '../../components/Button/Button';
import Chat from '../../components/Chat/Chat';
import Room from './Room/Room';

import './Lobby2.scss';

const Lobby3: React.FC<IBasePage> = ({ setPage }) => {
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [rooms, setRooms] = useState<TRoom[]>([]);
    const [_, setHash] = useState<string>('');
    const refRoomName = useRef<HTMLInputElement>(null!);
    const refRoomSize = useRef<number>(1);
    const user = store.getUser();
    /*const [isChatOpen, setIsChatOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    */

    /*
    useEffect(() => {
        server.showError((err: TError) => {
            setError(err.text);
        });
    }, []);
    */

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
        const count = refRoomSize.current;
        if (name && count) {
            server.createRoom(name, count);
        }
    }

    const roomSizeClickHandler = (count: number) => {
        refRoomSize.current = count;
    }

    return (<div className='lobby'>
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
                    text={String(count)}
                    className={cn('roomSize-button',
                        `btn-${count}`,
                        { 'active': refRoomSize.current === count }
                    )}
                />
            ))}
        </div>
        <Button
            onClick={createRoomClickHandler}
            text='create room'
            className='createRoom-button'
        />
        {rooms.length && rooms.map((room, index) => <Room key={index} room={room} setPage={setPage} />)}

        {/*<div className='lobby2'>
            <div className="create-join">
                <div className='error-section'>
                    {error && (
                        <div className="error-message">
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="room-info">
                {!room ? (
                    <div className="no-room-message">Комната не выбрана</div>
                ) : (
                )}
            </div>

            <Chat
                isOpen={isChatOpen}
                onToggle={setIsChatOpen}
            />

                            </div>*/}
    </div>
    );
}

export default Lobby3;