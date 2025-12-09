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

export type TUserInfoResponse = {
    characterId: number;
    userId: number;
    login: string;
    nickname: string;
    money: string;
}

export type TRoom = {
    id: number;
    status: 'open' | 'closed' | 'started';
    name: string;
    playersCount: number;
    roomSize: number;
    members: TRoomMember[];
}

export type TRoomsResponse = {
    status: 'unchanged' | 'updated';
    hash?: string;
    rooms?: TRoom[];
}

export type TRoomMember = {
    characterId: number,
    type: "owner" | "participant",
    status: "ready" | "started",
    userId: number,
    login: string,
    nickname: string,
    money: string
    token: string
}

export type TRoomMembersResponse = {
    roomStatus: 'open' | 'closed' | 'started';
    members?: TRoomMember[];
    hash?: string;
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