import { TRoom, TUser } from "../services/server/types";

export const useRoomUser = (room: TRoom | undefined, user: TUser | null) => {
    const owner = room?.members.find(member => member.type === 'owner');
    const member = room?.members.find(member => user?.id === member?.user_id);
    return {
        isOwner: user?.id === owner?.user_id,
        isUserRoomMember: !!member,
    };
};