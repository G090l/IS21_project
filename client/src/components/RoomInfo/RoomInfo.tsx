import React, { useContext, useEffect, useState } from 'react';
import { ServerContext, StoreContext } from '../../App';
import Button from '../Button/Button';
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
        if (room) {
            server.startGettingRoomMembers(room.id);
            loadMembers();
        }
        return () => {
            server.stopGettingRoomMembers();
        };
    }, [room]);

    const loadMembers = async () => {
        if (!room) return;
        const members = await server.getRoomMembers(room.id);
        if (members) {
            store.setRoomMembers(members.members);
        }
    };

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

    const dropFromRoomClickHandler = async (targetToken: string) => {
        const success = await server.dropFromRoom(targetToken);
        if (success) {
            loadMembers();
        }
    }

    if (!room) {
        return <div className="room-info">Комната не выбрана</div>;
    }

    const owner = roomMembers.find(member => member.type === 'owner')
    const isOwner = user?.id === owner?.character_id;
    const otherMembers = roomMembers.filter(member => member !== owner);

    return (<div className="room-info">
        <div className="room-name-section">
            {isRenaming ? (
                <>
                    <input
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        onBlur={renameRoomClickHandler}
                        autoFocus
                        className="rename-input"
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
            {owner && (
                <div className="owner-info">
                    <div className="owner-name">
                        {`Владелец: ${owner.character_id}`}
                    </div>
                </div>
            )}
        </div>
        {otherMembers.map(member => (
            <div key={member.character_id} className="user-item">
                <div className="user-info">
                    <div className="member-name">{member.nickname}</div>
                </div>
                {isOwner && user?.id !== member.character_id && (
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

    </div>)
}

export default RoomInfo;