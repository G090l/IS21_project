import React, { useContext, useEffect, useState } from 'react';
import { ServerContext, StoreContext } from '../../../App';
import Button from '../../../components/Button/Button';
import './RoomInfo.scss'

const RoomInfo: React.FC = () => {
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const user = store.getUser();
    const room = store.getCurrentRoom();
    const [isRenaming, setIsRenaming] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const roomMembers = store.getRoomMembers();

    useEffect(() => {
        const initializeRoom = async () => {
            if (!room) {
                const userRoom = await server.getUserRoom();
                if (userRoom) {
                    store.setCurrentRoom(userRoom);
                }
            }
        };
        initializeRoom();
    }, []);

    useEffect(() => {
        if (room) {
            server.startGettingRooms(() => { });
        }
        return () => {
            server.stopGettingRooms();
        };
    }, [room]);

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
    console.log('RoomMembers:', roomMembers.map(m => ({
        id: m.user_id,
        nickname: m.nickname,
        token: m.token,
        tokenLength: m.token?.length
    })));

    const dropFromRoomClickHandler = async (targetToken: string) => {
        const success = await server.dropFromRoom(targetToken);
        if (success) {
            await server.getRooms();
        }
    }

    const leaveRoomClickHandler = async () => {
        const success = await server.leaveRoom();
        if (success) {
            store.setCurrentRoom(null);
        }
    }

    if (!room) {
        return <div className="room-info">Комната не выбрана</div>;
    }

    const owner = roomMembers.find(member => member.type === 'owner')
    const isOwner = user?.id === owner?.user_id;

    return (<div className="room-info">
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
        <div className="players-count">
            Игроков: {room.players_count}/{room.room_size}
        </div>

        <div className="room-members">
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
        </div>
        <Button onClick={leaveRoomClickHandler} text='Покинуть комнату' />
    </div>)
}

export default RoomInfo;