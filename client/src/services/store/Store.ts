import { TMessages, TRoom, TRoomMember, TUser } from "../server/types";

const TOKEN = 'token';
const REMEMBER_ME = 'rememberMe';
const CHARACTER_HASH = 'characterHash';
const BOT_HASH = 'botHash';
const ARROW_HASH = 'arrowHash';

class Store {
    user: TUser | null = null;
    messages: TMessages = [];
    chatHash: string = 'empty chat hash';
    rooms: TRoom[] = [];
    roomHash: string = 'empty room  hash';
    // переобозвать
    roomMembersHash: string = 'empty room members hash';
    characterHash: string = 'empty character hash';
    botHash: string = 'empty bot hash';
    arrowHash: string = 'empty arrow hash';
    characters: TRoomMember[] = [];
    bots: any[] = [];
    arrows: any[] = [];

    rememberMe: boolean = false;

    constructor() {
        this.rememberMe = localStorage.getItem(REMEMBER_ME) === 'true';
        this.characterHash = localStorage.getItem(CHARACTER_HASH) || 'empty character hash';
        this.botHash = localStorage.getItem(BOT_HASH) || 'empty bot hash';
        this.arrowHash = localStorage.getItem(ARROW_HASH) || 'empty arrow hash';
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

    addRooms(newRooms: TRoom[] | undefined): void {
        if (newRooms?.length) {
            this.rooms = newRooms;
        }
    }

    getRooms(): TRoom[] {
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

    getCharacterHash(): string {
        return this.characterHash;
    }

    setCharacterHash(hash: string): void {
        this.characterHash = hash;
        localStorage.setItem(CHARACTER_HASH, hash);
    }

    getBotHash(): string {
        return this.botHash;
    }

    setBotHash(hash: string): void {
        this.botHash = hash;
        localStorage.setItem(BOT_HASH, hash);
    }

    getArrowHash(): string {
        return this.arrowHash;
    }

    setArrowHash(hash: string): void {
        this.arrowHash = hash;
        localStorage.setItem(ARROW_HASH, hash);
    }

    setCharacters(characters: TRoomMember[]): void {
        this.characters = characters;
    }

    getCharacters(): TRoomMember[] {
        return this.characters;
    }

    setBots(bots: any[]): void {
        this.bots = bots;
    }

    getBots(): any[] {
        return this.bots;
    }

    setArrows(arrows: any[]): void {
        this.arrows = arrows;
    }

    getArrows(): any[] {
        return this.arrows;
    }

    clearScene(): void {
        this.characters = [];
        this.bots = [];
        this.arrows = [];
        this.characterHash = 'empty character hash';
        this.botHash = 'empty bot hash';
        this.arrowHash = 'empty arrow hash';
        localStorage.removeItem(CHARACTER_HASH);
        localStorage.removeItem(BOT_HASH);
        localStorage.removeItem(ARROW_HASH);
    }
}

export default Store;