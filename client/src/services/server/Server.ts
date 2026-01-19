import md5 from 'md5';
import CONFIG from "../../config";
import Store from "../store/Store";
import { TAnswer, TClass, TError, TItem, TMessagesResponse, TRoom, TRoomMembersResponse, TRoomsResponse, TUser, TSceneResponse } from "./types";

const { CHAT_TIMESTAMP, ROOM_TIMESTAMP, HOST } = CONFIG;

class Server {
    HOST = HOST;
    store: Store;
    chatInterval: NodeJS.Timer | null = null;
    roomInterval: NodeJS.Timer | null = null;
    startGettingRoomsCb: ((hash: string) => void) | null = null;
    roomMembersInterval: NodeJS.Timer | null = null;
    sceneInterval: NodeJS.Timer | null = null;
    showErrorCb: (error: TError) => void = () => { };

    constructor(store: Store) {
        this.store = store;
    }

    // посылает запрос и обрабатывает ответ
    private async request<T>(method: string, params: { [key: string]: string | number } = {}): Promise<T | null> {
        try {
            params.method = method;
            const token = this.store.getToken();
            if (token) {
                params.token = token;
            }

            const response = await fetch(`${this.HOST}/?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`);

            const answer: TAnswer<T> = await response.json();
            if (answer.result === 'ok' && answer.data) {
                return answer.data;
            }
            answer.error && this.setError(answer.error);
            return null;
        } catch (e) {
            console.log(e);
            this.setError({
                code: 9000,
                text: 'Unknown error',
            });
            return null;
        }
    }

    private setError(error: TError): void {
        this.showErrorCb(error);
    }

    showError(cb: (error: TError) => void) {
        this.showErrorCb = cb;
    }

    async login(login: string, password: string): Promise<TUser | null> {
        const rnd = Math.round(Math.random() * 100000);
        const passwordHash = md5(`${md5(`${login}${password}`)}${rnd}`)
        const user = await this.request<TUser>('login', { login, passwordHash, rnd: `${rnd}` });
        if (user) {
            const userInfo = await this.request<TUser>('getUserInfo', { token: user.token });
            if (userInfo) {
                userInfo.token = user.token;
                this.store.setUser(userInfo);
                return userInfo;
            }
            this.store.setUser(user);
            return user;
        }
        return null;
    }

    async logout() {
        const result = await this.request<boolean>('logout');
        if (result) {
            this.store.clearUser();
        }
    }

    registration(login: string, password: string, nickname: string): Promise<TUser | null> {
        const passwordHash = md5(`${login}${password}`);
        return this.request<TUser>('registration', { login, passwordHash, nickname });
    }

    sendMessage(message: string): void {
        this.request<boolean>('sendMessage', { message });
    }

    async getMessages(): Promise<TMessagesResponse | null> {
        const hash = this.store.getChatHash();
        const result = await this.request<TMessagesResponse>('getMessages', { hash });
        if (result) {
            this.store.setChatHash(result.hash);
            return result;
        }
        return null;
    }

    startChatMessages(cb: (hash: string) => void): void {
        this.chatInterval = setInterval(async () => {
            const result = await this.getMessages();
            if (result) {
                const { messages, hash } = result;
                this.store.addMessages(messages);
                cb(hash);
            }
        }, CHAT_TIMESTAMP);

    }

    stopChatMessages(): void {
        if (this.chatInterval) {
            clearInterval(this.chatInterval);
            this.chatInterval = null;
            this.store.clearMessages();
        }
    }

    async getRoomsAndMembers(): Promise<TRoomsResponse | null> {
        const roomHash = this.store.getRoomHash();
        const result = await this.request<TRoomsResponse>('getRooms', { roomHash });
        if (result) {
            const { hash, rooms, status } = result;
            if (status === 'updated') {
                if (hash) {
                    this.store.setRoomHash(hash);
                }
                this.store.addRooms(rooms);
            }
            return result;
        }
        return null;
    }

    startGettingRooms(cb: (hash: string) => void): void {
        this.startGettingRoomsCb = cb;
        const tick = async () => {
            const result = await this.getRoomsAndMembers();
            if (!this.startGettingRoomsCb) return;
            this.startGettingRoomsCb(result?.hash ?? '');
        };
        this.roomInterval = setInterval(tick, ROOM_TIMESTAMP);
        tick();
    }

    stopGettingRooms(): void {
        if (this.roomInterval) {
            clearInterval(this.roomInterval);
            this.roomInterval = null;
        }
        this.startGettingRoomsCb = null;
    }

    createRoom(roomName: string, roomSize: number): Promise<boolean | null> {
        return this.request<boolean>('createRoom', { roomName, roomSize });
    }

    joinToRoom(roomId: number): Promise<boolean | null> {
        return this.request<boolean>('joinToRoom', { roomId });
    }

    leaveRoom(): Promise<boolean | null> {
        return this.request<boolean>('leaveRoom');
    }

    dropFromRoom(targetToken: string): Promise<boolean | null> {
        return this.request<boolean>('dropFromRoom', { targetToken });
    }

    async renameRoom(newRoomName: string): Promise<boolean | null> {
        return this.request<boolean>('renameRoom', { newRoomName });
    }

    async deleteUser(): Promise<boolean> {
        const result = await this.request<boolean>('deleteUser');
        if (result) {
            this.store.clearUser();
        }
        return !!result;
    }

    startGame(): Promise<boolean | null> {
        return this.request<boolean>('startGame');
    }

    async getUserInfo(): Promise<TUser | null> {
        const token = this.store.getToken();
        if (!token) return null;

        const user = await this.request<TUser>('getUserInfo');
        if (user) {
            user.token = token;
            this.store.setUser(user)
            return user;
        }
        return null;
    }

    getAllItems(): Promise<TItem[] | null> {
        return this.request<TItem[]>("getItemsData");
    }

    getClasses(): Promise<TClass[] | null> {
        return this.request<TClass[]>('getClasses');
    }

    async selectClass(classId: number): Promise<boolean | null> {
        const result = await this.request<boolean>('selectClass', { classId });
        if (result) {
            this.store.setSelectedClass(classId);
        }
        return null;
    }

    async getScene(): Promise<TSceneResponse | null> {
        const token = this.store.getToken() || 'empty token'
        const characterHash = this.store.getCharacterHash() || 'empty charcter hash'
        const botHash = this.store.getBotHash() || 'empty bot hash';
        const arrowHash = this.store.getArrowHash() || 'empty arrow hash';

        const result = await this.request<TSceneResponse>('getScene', {
            token,
            characterHash,
            botHash,
            arrowHash
        });

        if (result) {
            if (result.status === 'updated') {
                this.store.setCharacterHash(result.characterHash || '');
                this.store.setBotHash(result.botHash || '');
                this.store.setArrowHash(result.arrowHash || '');
            }
            this.store.setGameStatus(result.gameStatus || '');
            return result;
        }
        return null;
    }

    async updateCharacter(characterData: string): Promise<boolean | null> {
        return this.request<boolean>('updateCharacter', { characterData });
    }

    async updateArrows(arrowsData: string): Promise<boolean | null> {
        return this.request<boolean>('updateArrows', { arrowsData });
    }

    async updateEnemy(enemyData: string): Promise<boolean | null> {
        return this.request<boolean>('updateBots', { enemyData });
    }
}

export default Server;