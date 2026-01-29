import React, { useContext } from "react";
import { ServerContext, StoreContext } from "../../../App";
import { TRoomMember } from "../../../services/server/types";
import Button from "../../../components/Button/Button";

const Member: React.FC<{ isOwner: boolean, member: TRoomMember }> = ({ isOwner, member }) => {
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const user = store.getUser();

    const { nickname, token, type } = member;

    const dropFromRoomClickHandler = (targetToken: string) => server.dropFromRoom(targetToken);

    return (<>
        <div className="room-members">
            <div className="member-name">
                <span>{`Имя: ${nickname}`}</span>
                {type === 'owner' &&
                    <span className="host"> - хост</span>
                }
            </div>
            {isOwner && user?.token !== token && (
                <div className="user-actions">
                    <Button
                        className="dropFromRoom-button"
                        text="Кикнуть"
                        onClick={() => dropFromRoomClickHandler(token)}
                    />
                </div>)}
        </div>
    </>);
}

export default Member;