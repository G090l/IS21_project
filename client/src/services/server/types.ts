import { ECLASSTYPE, EITEMTYPE, EWEAPONTYPE } from "../../config";
import { TCharacterClass } from "../../game/types/CharacterClass";

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
    userId: number;
    login: string;
    nickname: string;
    money: number;
    characterId: number;
    selectedClass: number;
    purchasedClasses: number[];
    purchasedItems: { itemId: number, quantity: number }[];
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
    type: "owner" | "participant";
    status: "ready" | "started";
    userId: number;
    login: string;
    nickname: string;
    money: string;
    token: string;
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

export type TClass = TCharacterClass & {
    id: number;
}

export type TItem = {
    id: number;
    cost: number;
    itemType: EITEMTYPE;
    weaponType: EWEAPONTYPE | null;
    attackSpeed: number | null;
    attackDistance: number | null;
    bonusDefense: number | null;
    bonusHp: number | null;
}

export type TSceneResponse = {
    status: 'unchanged' | 'updated';
    gameStatus: string;
    characterHash?: string;
    characters?: TRoomMember[];
    botHash?: string;
    botsData?: string;
    arrowHash?: string;
    arrowsData?: string;
}