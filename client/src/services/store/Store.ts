import { TMessages, TRoom, TRoomMember, TRooms, TUser } from "../server/types";

const TOKEN = 'token';
const REMEMBER_ME = 'rememberMe';

class Store {
    user: TUser | null = null;
    messages: TMessages = [];
    chatHash: string = 'empty chat hash';
    rooms: TRooms = [];
    roomHash: string = 'empty room  hash';
    currentRoom: TRoom | null = null;
    roomMembers: TRoomMember[] = [];
    roomMembersHash: string = 'empty room members hash';

    rememberMe: boolean = false;

    constructor() {
        this.rememberMe = localStorage.getItem(REMEMBER_ME) === 'true';
    }

    setToken(token: string, rememberMe = false): void {
        this.rememberMe = rememberMe;
        if (rememberMe) {
            localStorage.setItem(REMEMBER_ME, 'true');
            localStorage.setItem(TOKEN, token);
        } else {
            localStorage.setItem(REMEMBER_ME, 'false');
            sessionStorage.setItem(TOKEN, token);
        }

    }

    getToken(): string {
        const token = sessionStorage.getItem(TOKEN) || localStorage.getItem(TOKEN);
        return token || '';
    }

    getRememberMe(): boolean {
        return this.rememberMe;
    }

    setUser(user: TUser, rememberMe = false): void {
        const { token } = user;
        this.setToken(token, rememberMe);
        this.user = user;
    }

    getUser(): TUser | null {
        return this.user;
    }

    clearUser(): void {
        this.user = null;
        sessionStorage.removeItem(TOKEN);
        localStorage.removeItem(TOKEN);
        localStorage.removeItem(REMEMBER_ME);
        this.rememberMe = false;
    }

    addMessages(newMessages: TMessages): void {
        if (newMessages?.length) {
            this.messages = this.messages.concat(newMessages);
        }
    }

    getMessages(): TMessages {
        return this.messages;
    }

    clearMessages(): void {
        this.messages = [];
    }

    getChatHash(): string {
        return this.chatHash;
    }

    setChatHash(hash: string): void {
        this.chatHash = hash;
    }

    addRooms(newRooms: TRooms | undefined): void {
        if (newRooms?.length) {
            this.rooms = newRooms;
        }
    }

    getRooms(): TRooms {
        return this.rooms;
    }

    clearRooms(): void {
        this.rooms = [];
    }

    getRoomHash(): string {
        return this.roomHash;
    }

    setRoomHash(hash: string | undefined): void {
        if (hash) {
            this.roomHash = hash;
        }
    }

    updateRoomName(newName: string): void {
        const currentRoom = this.getCurrentRoom();
        if (currentRoom) {
            currentRoom.name = newName;
        }
    }

    setCurrentRoom(room: TRoom | null): void {
        this.currentRoom = room;
    };

    getCurrentRoom(): TRoom | null {
        return this.currentRoom;
    };

    addRoomMembers(members: TRoomMember[]): void {
        if (members?.length) {
            this.roomMembers = members;
        }
    }

    setRoomMembers(members: TRoomMember[] | undefined): void {
        this.roomMembers = members || [];
    };

    getRoomMembers(): TRoomMember[] {
        return this.roomMembers || [];
    };

    getRoomMembersHash(): string {
        return this.roomMembersHash;
    }

    setRoomMembersHash(hash: string | undefined): void {
        if (hash) {
            this.roomMembersHash = hash;
        }
    }
}

export default Store;