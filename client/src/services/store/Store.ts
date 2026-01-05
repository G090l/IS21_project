import { TClass, TItem, TMessages, TRoom, TRoomMember, TUser } from "../server/types";

const TOKEN = 'token';
const REMEMBER_ME = 'rememberMe';
const CHARACTER_HASH = 'characterHash';
const BOT_HASH = 'botHash';
const ARROW_HASH = 'arrowHash';
const GAME_STATUS = 'gameStatus';

class Store {
    user: TUser | null = null;
    messages: TMessages = [];
    rooms: TRoom[] = [];
    allClasses: TClass[] = [];
    allItems: TItem[] = [];
    chatHash: string = 'empty chat hash';
    roomHash: string = 'empty room hash';
    roomMembersHash: string = 'empty room members hash';
    characterHash: string = 'empty character hash';
    botHash: string = 'empty bot hash';
    arrowHash: string = 'empty arrow hash';
    gameStatus: string = '';

    rememberMe: boolean = false;

    constructor() {
        this.rememberMe = Boolean(localStorage.getItem(REMEMBER_ME));
        this.characterHash = localStorage.getItem(CHARACTER_HASH) || 'empty character hash';
        this.botHash = localStorage.getItem(BOT_HASH) || 'empty bot hash';
        this.arrowHash = localStorage.getItem(ARROW_HASH) || 'empty arrow hash';
        this.gameStatus = localStorage.getItem(GAME_STATUS) || '';
    }

    setToken(token: string, rememberMe = false): void {
        this.rememberMe = rememberMe;
        if (rememberMe) {
            localStorage.setItem(REMEMBER_ME, 'true');
            localStorage.setItem(TOKEN, token);
        } else {
            localStorage.setItem(REMEMBER_ME, '');
            sessionStorage.setItem(TOKEN, token);
        }
    }

    getToken(): string {
        const token = sessionStorage.getItem(TOKEN) || localStorage.getItem(TOKEN);
        return token || '';
    }

    getUserRoom(): TRoom | null {
        const user = this.getUser();
        if (!user) return null;

        return this.rooms.find(room =>
            room.members?.some(member => member.userId === user.userId)
        ) || null;
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

    //Вызывается единожды при логине
    setClasses(classes: TClass[]): void {
        this.allClasses = classes;
    }

    //Вызывается единожды при логине
    setItems(items: TItem[]): void {
        this.allItems = items;
    }

    setSelectedClass(classId: number): void {
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

    setGameStatus(status: string): void {
        this.gameStatus = status;
        localStorage.setItem(GAME_STATUS, status);
    }

    getGameStatus(): string {
        return this.gameStatus;
    }

    clearGameData(): void {
        this.characterHash = 'empty character hash';
        this.botHash = 'empty bot hash';
        this.arrowHash = 'empty arrow hash';
        this.gameStatus = '';

        localStorage.removeItem(CHARACTER_HASH);
        localStorage.removeItem(BOT_HASH);
        localStorage.removeItem(ARROW_HASH);
        localStorage.removeItem(GAME_STATUS);
    }
}

export default Store;