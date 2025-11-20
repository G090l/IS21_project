import Game from '../game/Game';
import Server from '../services/server/Server';
import LobbyMap from './LobbyMap';

class LobbyGame extends Game {
    constructor(server: Server) {
        super(server);

        const lobbyMap = new LobbyMap();
        // @ts-ignore
        this.walls = lobbyMap.walls;
        // @ts-ignore
        this.gameMap.walls = lobbyMap.walls;
    }
}
export default LobbyGame;