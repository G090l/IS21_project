import Game from '../game/Game';
import Server from '../services/server/Server';
import Store from '../services/store/Store';
import LobbyMap from './LobbyMap';

class LobbyGame extends Game {
    constructor(server: Server, store: Store) {
        super(server, store);

        const lobbyMap = new LobbyMap();
        // @ts-ignore
        this.enemies = [];
        // @ts-ignore
        this.walls = lobbyMap.walls;
        // @ts-ignore
        this.gameMap.walls = lobbyMap.walls;
    }
}
export default LobbyGame;