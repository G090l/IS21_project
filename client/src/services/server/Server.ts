import md5 from 'md5';
import CONFIG from "../../config";
import Store from "../store/Store";
import { TAnswer, TError, TMessagesResponse, TRoom, TRoomMember, TRoomMembersResponse, TRoomsResponse, TSceneResponse, TUser } from "./types";

const { CHAT_TIMESTAMP, ROOM_TIMESTAMP, HOST } = CONFIG;

class Server {
    HOST = HOST;
    store: Store;
    chatInterval: NodeJS.Timer | null = null;
    roomInterval: NodeJS.Timer | null = null;
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
        if (result?.status === 'updated') {
            const { hash, rooms } = result;
            this.store.setRoomHash(hash);
            this.store.addRooms(rooms);
            return result;
        }
        return null;
    }

    startGettingRooms(cb: (hash: string) => void): void {
        this.roomInterval = setInterval(async () => {
            const result = await this.getRoomsAndMembers();
            if (result) {
                const { hash } = result;
                hash && cb(hash);
            }
        }, ROOM_TIMESTAMP);
    }

    stopGettingRooms(): void {
        if (this.roomInterval) {
            clearInterval(this.roomInterval);
            this.roomInterval = null;
        }
    }

    async getUserRoom(): Promise<TRoom | null> {
        const user = this.store.getUser();
        const roomsResponse = await this.getRoomsAndMembers();
        if (!roomsResponse?.rooms) return null;
        return roomsResponse.rooms.find(room =>
            room.members?.some(member => member.userId === user?.id)
        ) || null;
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

    async getUserInfo(): Promise<{ userId: number; login: string; nickname: string; money: number } | null> {
        const token = this.store.getToken();
        if (!token) return null;

        const userInfo = await this.request<{ characterId: number; userId: number; login: string; nickname: string; money: number; }>('getUserInfo');
        if (userInfo) {
            const user: TUser = {
                id: userInfo.userId,
                login: userInfo.login,
                nickname: userInfo.nickname,
                money: userInfo.money,
                token: token
            };
            this.store.setUser(user);
            return userInfo;
        }
        return null;
    }

    async getScene(): Promise<TSceneResponse | null> {
        const characterHash = this.store.getCharacterHash();
        const botHash = this.store.getBotHash();
        const arrowHash = this.store.getArrowHash();

        const result = await this.request<TSceneResponse>('getScene', {
            characterHash,
            botHash,
            arrowHash
        });
        console.log(result)
        this.store.setCharacterHash(result?.character_hash || '');
        this.store.setBotHash(result?.bot_hash || '');
        this.store.setArrowHash(result?.arrow_hash || '');

        return result;
    }

    async updateCharacter(characterData: string): Promise<boolean | null> {
        const result = await this.request<boolean>('updateCharacter', {
            characterData
        });
        return result;
    }

    startGetScene(callback: (scene: TSceneResponse) => void): void {
        console.log('aboba2')
        this.sceneInterval = setInterval(async () => {
            const scene = await this.getScene();
            if (scene) {
                callback(scene);
            }
        }, ROOM_TIMESTAMP || 1000);
    }

    stopGetScene(): void {
        if (this.sceneInterval) {
            clearInterval(this.sceneInterval);
            this.sceneInterval = null;
        }
    }

    // Обновление сцены (отправка данных своего персонажа и получение всех данных)
    async updateScene(heroJson: string): Promise<TSceneResponse | null> {
        // Отправляем данные своего персонажа
        await this.updateCharacter(heroJson);

        // Получаем обновленную сцену со всеми персонажами
        return await this.getScene();
    }
}

export default Server;