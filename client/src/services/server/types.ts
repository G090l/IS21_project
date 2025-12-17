export type TError = {
    code: number;
    text: string;
}

export type TSceneResponse = {
    status: 'unchanged' | 'updated';
    game_status: 'open' | 'closed' | 'started';
    character_hash?: string;
    bot_hash?: string;
    arrow_hash?: string;
    characters?: TRoomMember[];
    bots?: TBotInRoom[];
    arrows?: TArrowInRoom[];
}

export type TBotInRoom = {
    id: number,
    roomId: number,
    data: string;
}

export type TArrowInRoom = {
    id: number,
    roomId: number,
    data: string;
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
    id: number,
    characterId: number,
    type: 'owner' | 'participant',
    status: 'ready' | 'started',
    data: string,
    userId: number,
    login: string,
    nickname: string,
    money: string,
    token: string,
    selectedClass: number
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