import React, { useContext } from "react";
import { ServerContext} from "../../../App";
import { TRoom } from "../../../services/server/types";
import Button from "../../../components/Button/Button";

const Room: React.FC<{ room: TRoom }> = ({ room }) => {
    const server = useContext(ServerContext);
    const { id, name, playersCount, roomSize } = room;

    const joinToRoomClickHandler = (roomId: number) => server.joinToRoom(roomId);

    return (<>
        {playersCount !== roomSize && (
            <Button
                onClick={() => joinToRoomClickHandler(id)}
                className="room-item"
                text={`Комната ${name}\nИгроков: ${playersCount}/${roomSize}`}
            />
        )}
    </>);
}

export default Room;