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

    public function login($params) {
        $check = requireParams($params, ['login', 'passwordHash', 'rnd']);
        if (!$check) return Answer::error(242);

        return $this->user->login($params['login'], $params['passwordHash'], $params['rnd']);
    }

    public function logout($params) {
        $check = requireParams($params, ['token']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->user->logout($params['token']);
    }

    public function registration($params) {
        $check = requireParams($params, ['login', 'passwordHash', 'nickname']);
        if (!$check) return Answer::error(242);

        return $this->user->registration($params['login'], $params['passwordHash'], $params['nickname']);
    }

    public function getUserInfo($params) {
        $check = requireParams($params, ['token']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->user->getUserInfo($user->id);
    }

    public function getClasses($params) {
        return $this->classes->getClasses();
    }

    public function math($params) {
        $a = (float) ($params['a'] ?? 0);
        $b = (float) ($params['b'] ?? 0);
        $c = (float) ($params['c'] ?? 0);
        $d = (float) ($params['d'] ?? 0);
        $e = (float) ($params['e'] ?? 0);
        
        if ($a != 0 || $b != 0 || $c != 0 || $d != 0 || $e != 0) {
            return $this->math->getAnswers($a, $b, $c, $d, $e);
        }
        return ['error' => 8001];
    }

    // Chat
    public function sendMessage($params) {
        $check = requireParams($params, ['token', 'message']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->chat->sendMessage($user->id, $params['message']);
    }

    public function getMessages($params) {
        $check = requireParams($params, ['token', 'hash']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->chat->getMessages($params['hash']);
    }

    // Lobby
    public function createRoom($params) {
        $check = requireParams($params, ['token', 'roomName', 'roomSize']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        $roomSize = (int)$params['roomSize'];
        return $this->lobby->createRoom($user->id, $params['roomName'], $roomSize);
    }

    public function joinToRoom($params) {
        $check = requireParams($params, ['token', 'roomId']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->lobby->joinToRoom($params['roomId'], $user->id);
    }

    public function leaveRoom($params) {
        $check = requireParams($params, ['token']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->lobby->leaveRoom($user->id);
    }

    public function dropFromRoom($params) {
        $check = requireParams($params, ['token', 'targetToken']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->lobby->dropFromRoom($user->id, $params['targetToken']);
    }

    public function deleteUser($params) {
        $check = requireParams($params, ['token']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->user->deleteUser($params['token']);
    }

    public function startGame($params) {
        $check = requireParams($params, ['token']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->lobby->startGame($user->id);
    }

    public function renameRoom($params) {
        $check = requireParams($params, ['token', 'newRoomName']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->lobby->renameRoom($user->id, $params['newRoomName']);
    }

    public function getRooms($params) {
        $check = requireParams($params, ['token', 'room_hash']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->lobby->getRooms($params['room_hash']);
    }

    // Classes
    public function getUserOwnedClasses($params) {
        $check = requireParams($params, ['token']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->classes->getUserOwnedClasses($user->id);
    }

    public function buyClass($params) {
        $check = requireParams($params, ['token', 'classId']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->classes->buyClass($user->id, $params['classId']);
    }

    public function selectClass($params) {
        $check = requireParams($params, ['token', 'classId']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->classes->selectClass($user->id, $params['classId']);
    }

    // ItemManager
    public function buyItem($params) {
        $check = requireParams($params, ['token', 'itemId']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        $item = checkItemExists($this->db, $params['itemId']);
        if (!$item) return Answer::error(4001);

        return $this->itemManager->buyItem($user->id, $params['itemId']);
    }

    public function sellItem($params) {
        $check = requireParams($params, ['token', 'itemId']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->itemManager->sellItem($user->id, $params['itemId']);
    }

    public function checkBowAndArrows($params) {
        $check = requireParams($params, ['token']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->itemManager->checkBowAndArrows($user->id);
    }

    public function consumeArrow($params) {
        $check = requireParams($params, ['token']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->itemManager->consumeArrow($user->id);
    }

    // Game
    public function getScene($params) {
        $check = requireParams($params, ['roomId', 'characterHash', 'botHash', 'arrowHash']);
        if (!$check) return Answer::error(242);

        return $this->game->getScene($params['roomId'], $params['characterHash'], $params['botHash'], $params['arrowHash']);
    }

    public function getBots($params) {
        $check = requireParams($params, ['roomId']);
        if (!$check) return Answer::error(242);

        return $this->game->getBots($params['roomId']);
    }

    public function getBotsData($params) {
        return $this->game->getBotsData();
    }

    public function getArrows($params) {
        $check = requireParams($params, ['roomId']);
        if (!$check) return Answer::error(242);

        return $this->game->getArrows($params['roomId']);
    }

    public function updateCharacter($params) {
        $check = requireParams($params, ['token', 'characterData']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->game->updateCharacter($user->id, $params['characterData']);
    }

    public function updateBots($params) {
        $check = requireParams($params, ['token', 'botsData']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->game->updateBots($user->id, $params['botsData']);
    }

    public function updateArrows($params) {
        $check = requireParams($params, ['token', 'arrowsData']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->game->updateArrows($user->id, $params['arrowsData']);
    }

    public function addMoneyForKill($params) {
        $check = requireParams($params, ['token', 'killerToken', 'botTypeId']);
        if (!$check) return Answer::error(242);

        $user = checkUserByToken($this->db, $params['token']);
        if (!$user) return Answer::error(705);

        return $this->game->addMoneyForKill($user->id, $params['killerToken'], $params['botTypeId']);
    }
}
