import React, { useContext, useRef } from "react";
import { ServerContext, StoreContext } from "../../../App";
import { TRoom } from "../../../services/server/types";
import Button from "../../../components/Button/Button";
import { IBasePage, PAGES } from "../../PageManager";
import { useRoomUser } from '../../../hooks/useRoomUser';
import Member from "../Member/Member";
import './RoomInfo.scss'

const RoomInfo: React.FC<IBasePage & { room: TRoom }> = ({ setPage, room }) => {
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const refNewName = useRef<HTMLInputElement>(null!);
    const user = store.getUser();
    const { name, playersCount, roomSize, members } = room;

    const { isOwner, isUserRoomMember } = useRoomUser(room, user);

    const startGameClickHandler = async () => {
        const success = await server.startGame();
        if (success) {
            setPage(PAGES.GAME);
        }
    }

    const leaveRoomClickHandler = () => server.leaveRoom();
    const renameRoomClickHandler = async () => {
        const newName = refNewName.current.value;
        if (newName && name !== newName) {
            server.renameRoom(newName);
        }
    };

    return (<div className="room-info">
        {isOwner && <>
            <input
                ref={refNewName}
                autoFocus
                className="rename-input"
                maxLength={20}
            />
            <Button
                text="✓"
                onClick={renameRoomClickHandler}
                className="confirm-rename-button"
            />
        </>}
        {isUserRoomMember && <>
            <div>
                <span>{`Название: ${name}`}</span>
            </div>
            <div>
                <span>Участники: {playersCount}/{roomSize}</span>
                {members.length && members.map(
                    (member, index) => <Member key={index} isOwner={isOwner} member={member} />
                )}
            </div>
            <Button onClick={leaveRoomClickHandler} text='leave room' />
        </>}
        {isOwner &&
            <Button onClick={startGameClickHandler} text='Начать игру' />
        }

    </div>)
}

export default RoomInfo;