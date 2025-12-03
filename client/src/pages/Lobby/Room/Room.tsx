import React, { useContext, useRef } from "react";
import { ServerContext, StoreContext } from "../../../App";
import { TRoom } from "../../../services/server/types";
import Button from "../../../components/Button/Button";
import { IBasePage, PAGES } from "../../PageManager";
import { useRoomUser } from '../../../hooks/useRoomUser';
import Member from "../Member/Member";

const Room: React.FC<IBasePage & { room: TRoom }> = ({ setPage, room }) => {
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const refNewName = useRef<HTMLInputElement>(null!);
    const user = store.getUser();
    const { id, name, players_count, room_size, members } = room;

    const { isOwner, isUserRoomMember } = useRoomUser(room, user);

    const startGameClickHandler = async () => {
        const success = await server.startGame();
        if (success) {
            setPage(PAGES.GAME);
        }
    }
    const joinToRoomClickHandler = (roomId: number) => server.joinToRoom(roomId);
    const leaveRoomClickHandler = () => server.leaveRoom();
    const renameRoomClickHandler = async () => {
        const newName = refNewName.current.value;
        if (newName && name !== newName) {
            server.renameRoom(newName);
        }
    };

    return (<>
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
                <span>Участники: {players_count}/{room_size}</span>
                {members.length && members.map(
                    (member, index) => <Member key={index} isOwner={isOwner} member={member} />
                )}
            </div>
            <Button onClick={leaveRoomClickHandler} text='leave room' />
        </>}
        {isOwner &&
            <Button onClick={startGameClickHandler} text='Начать игру' />
        }
        <Button
            onClick={() => joinToRoomClickHandler(id)}
            className="room-item"
            text={`Комната ${name}\nИгроков: ${players_count}/${room_size}`}
        />
    </>);
}

export default Room;