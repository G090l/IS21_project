import React, { useContext } from "react";
import { ServerContext} from "../../../App";
import { TRoom } from "../../../services/server/types";
import Button from "../../../components/Button/Button";

const Room: React.FC<{ room: TRoom }> = ({ room }) => {
    const server = useContext(ServerContext);
    const { id, name, players_count, room_size } = room;

    const joinToRoomClickHandler = (roomId: number) => server.joinToRoom(roomId);

    return (<>
        {players_count !== room_size && (
            <Button
                onClick={() => joinToRoomClickHandler(id)}
                className="room-item"
                text={`Комната ${name}\nИгроков: ${players_count}/${room_size}`}
            />
        )}
    </>);
}

export default Room;