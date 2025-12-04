<?php
require_once ('db/DB.php');
require_once ('user/User.php');
require_once ('chat/Chat.php');
require_once ('math/Math.php');
require_once ('lobby/Lobby.php');
require_once('classes/Classes.php');
require_once('itemManager/ItemManager.php');
require_once('game/Game.php');
require_once('Config.php');

class Application {
    private $db;

    function __construct() {
        $db = new DB();
        $this->db = $db;
        $this->user = new User($db);
        $this->math = new Math();
        $this->lobby = new Lobby($db);
        $this->classes = new Classes($db);
        $this->chat = new Chat($db);
        $this->itemManager = new ItemManager($db);
        $this->game = new Game($db);
    }

    //User
    public function login($params) {
        $check = checkParams($params, ['login', 'passwordHash', 'rnd']);
        if (is_array($check)) return $check;

        return $this->user->login($params['login'], $params['passwordHash'], $params['rnd']);
    }

    public function logout($params) {
        $check = checkParams($params, ['token']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->user->logout($params['token']);
    }

    public function registration($params) {
        $check = checkParams($params, ['login', 'passwordHash', 'nickname']);
        if (is_array($check)) return $check;

        return $this->user->registration($params['login'], $params['passwordHash'], $params['nickname']);
    }

    public function getUserInfo($params) {
        $check = checkParams($params, ['token']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->user->getUserInfo($user->id);
    }

    //Classes
    public function getClasses($params) {
        return $this->classes->getClasses();
    }

    public function buyClass($params) {
        $check = checkParams($params, ['token', 'classId']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->classes->buyClass($user->id, $params['classId']);
    }

    public function selectClass($params) {
        $check = checkParams($params, ['token', 'classId']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->classes->selectClass($user->id, $params['classId']);
    }

    //Math
    public function math($params) {
        $a = (float) ($params['a'] ?? 0);
        $b = (float) ($params['b'] ?? 0);
        $c = (float) ($params['c'] ?? 0);
        $d = (float) ($params['d'] ?? 0);
        $e = (float) ($params['e'] ?? 0);

        if ($a != 0 || $b != 0 || $c != 0 || $d != 0 || $e != 0) {
            return $this->math->getAnswers($a, $b, $c, $d, $e);
        }
        return Answer::error(8001);
    }
    //Chat
    public function sendMessage($params) {
        $check = checkParams($params, ['token', 'message']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->chat->sendMessage($user->id, $params['message']);
    }

    public function getMessages($params) {
        $check = checkParams($params, ['token', 'hash']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->chat->getMessages($params['hash']);
    }

    //Lobby
    public function createRoom($params) {
        $check = checkParams($params, ['token', 'roomName', 'roomSize']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        $roomSize = (int)$params['roomSize'];
        return $this->lobby->createRoom($user->id, $params['roomName'], $roomSize);
    }

    public function joinToRoom($params) {
        $check = checkParams($params, ['token', 'roomId']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->lobby->joinToRoom($params['roomId'], $user->id);
    }

    public function leaveRoom($params) {
        $check = checkParams($params, ['token']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->lobby->leaveRoom($user->id);
    }

    public function dropFromRoom($params) {
        $check = checkParams($params, ['token', 'targetToken']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->lobby->dropFromRoom($user->id, $params['targetToken']);
    }

    public function deleteUser($params) {
        $check = checkParams($params, ['token']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->user->deleteUser($params['token']);
    }

    public function startGame($params) {
        $check = checkParams($params, ['token']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->lobby->startGame($user->id);
    }

    public function renameRoom($params) {
        $check = checkParams($params, ['token', 'newRoomName']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->lobby->renameRoom($user->id, $params['newRoomName']);
    }

    public function getRooms($params) {
        $check = checkParams($params, ['token', 'room_hash']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->lobby->getRooms($params['room_hash']);
    }

    //ItemManager
    public function buyItem($params) {
        $check = checkParams($params, ['token', 'itemId']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        if (is_array($item = checkItemExists($this->db, $params['itemId']))) return $item;

        return $this->itemManager->buyItem($user->id, $params['itemId']);
    }

    public function sellItem($params) {
        $check = checkParams($params, ['token', 'itemId']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->itemManager->sellItem($user->id, $params['itemId']);
    }

    public function checkBowAndArrows($params) {
        $check = checkParams($params, ['token']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->itemManager->checkBowAndArrows($user->id);
    }

    public function consumeArrow($params) {
        $check = checkParams($params, ['token']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->itemManager->consumeArrow($user->id);
    }
    
    //Game
    public function getScene($params) {
        $check = checkParams($params, ['roomId', 'characterHash', 'botHash', 'arrowHash']);
        if (is_array($check)) return $check;

        return $this->game->getScene($params['roomId'], $params['characterHash'], $params['botHash'], $params['arrowHash']);
    }

    public function getBots($params) {
        $check = checkParams($params, ['roomId']);
        if (is_array($check)) return $check;

        return $this->game->getBots($params['roomId']);
    }

    public function getBotsData($params) {
        return $this->game->getBotsData();
    }

    public function getArrows($params) {
        $check = checkParams($params, ['roomId']);
        if (is_array($check)) return $check;

        return $this->game->getArrows($params['roomId']);
    }

    public function updateCharacter($params) {
        $check = checkParams($params, ['token', 'characterData']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->game->updateCharacter($user->id, $params['characterData']);
    }

    public function updateBots($params) {
        $check = checkParams($params, ['token', 'botsData']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->game->updateBots($user->id, $params['botsData']);
    }

    public function updateArrows($params) {
        $check = checkParams($params, ['token', 'arrowsData']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->game->updateArrows($user->id, $params['arrowsData']);
    }

    public function addMoneyForKill($params) {
        $check = checkParams($params, ['token', 'killerToken', 'botTypeId']);
        if (is_array($check)) return $check;

        if (is_array($user = checkUserByToken($this->db, $params['token']))) return $user;

        return $this->game->addMoneyForKill($user->id, $params['killerToken'], $params['botTypeId']);
    }
}
