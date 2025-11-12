export type TError = {
    code: number;
    text: string;
}

export type TAnswer<T> = {
    result: 'ok' | 'error';
    data?: T;
    error?: TError;
}

export type TUser = {
    id: number;
    login: string;
    nickname: string;
    money: number;
    token: string;
}

export type TRooms = TRoom[];
export type TRoom = {
    id: number;
    status: 'open' | 'closed' | 'started';
    name: string;
    players_count: number;
    room_size: number;
}

export type TRoomsResponse = {
    status: 'unchanged' | 'updated';
    hash?: string;
    rooms?: TRooms;
}

export type TRoomMembers = TRoomMember[];
export type TRoomMember = {
    id: number;
    room_id: number;
    character_id: number;
    type: 'owner' | 'participant';
}

export type TRoomMembersResponse = {
    hash?: string;
    members?: TRoomMembers;
}

export type TMessage = {
    message: string;
    author: string;
    created: string;
}

export type TMessages = TMessage[];
export type TMessagesResponse = {
    messages: TMessages;
    hash: string;
}