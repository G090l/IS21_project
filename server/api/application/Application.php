<?php
require_once ('db/DB.php');
require_once ('user/User.php');
require_once ('chat/Chat.php');
require_once ('math/Math.php');
require_once ('lobby/Lobby.php');
require_once('classes/Classes.php');
require_once('itemManager/ItemManager.php');
require_once('game/Game.php');

class Application {
    function __construct() {
        $db = new DB();
        $this->user = new User($db);
        $this->math = new Math();
        $this->lobby = new Lobby($db);
        $this->classes = new Classes($db);
        $this->chat = new Chat($db);
        $this->itemManager = new ItemManager($db);
        $this->game = new Game($db);
    }

    public function login($params) {
        if ($params['login'] && $params['passwordHash']) {
            return $this->user->login($params['login'], $params['passwordHash'], $params['rnd']);
        }
        return ['error' => 242];
    }

    public function logout($params) {
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->user->logout($params['token']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function registration($params) {
        if ($params['login'] && $params['passwordHash'] && $params['nickname']) {
            return $this->user->registration($params['login'], $params['passwordHash'], $params['nickname']);
        }
        return ['error' => 242];
    }

    public function getUserInfo($params) {
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->user->getUserInfo($user->id);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
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

    //Chat
    public function sendMessage($params) {
        if ($params['token'] && $params['message']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->chat->sendMessage($user->id, $params['message']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function getMessages($params) {
        if ($params['token'] && $params['hash']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->chat->getMessages($params['hash']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    //Lobby
    public function createRoom($params) {
        if ($params['token'] && $params['roomName'] && $params['roomSize']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                $roomSize = (int)$params['roomSize'];
                return $this->lobby->createRoom($user->id, $params['roomName'], $roomSize);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function joinToRoom($params) {
        if ($params['token'] && $params['roomId']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->lobby->joinToRoom($params['roomId'], $user->id);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function leaveRoom($params) {
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->lobby->leaveRoom($user->id);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function dropFromRoom($params) {
        if ($params['token'] && $params['targetToken']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->lobby->dropFromRoom($user->id, $params['targetToken']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function deleteUser($params) {
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->user->deleteUser($params['token']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function startGame($params) {
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->lobby->startGame($user->id);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function renameRoom($params) {
        if ($params['token'] && $params['newRoomName']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->lobby->renameRoom($user->id, $params['newRoomName']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function getRooms($params) {
        if ($params['token'] && $params['room_hash']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->lobby->getRooms($params['room_hash']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    //Classes
    public function getUserOwnedClasses($params) {
        if (!empty($params['token'])) {
            $user = $this->user->getUser($params['token']);
            if ($user) return $this->classes->getUserOwnedClasses($user->id);
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function buyClass($params) {
        if (!empty($params['token']) && !empty($params['classId'])) {
            $user = $this->user->getUser($params['token']);
            if ($user) return $this->classes->buyClass($user->id, $params['classId']);
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function selectClass($params) {
        if (!empty($params['token']) && !empty($params['classId'])) {
            $user = $this->user->getUser($params['token']);
            if ($user) return $this->classes->selectClass($user->id, $params['classId']);
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    //ItemManager
    public function buyItem($params) {
        if ($params['token'] && $params['itemId']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->itemManager->buyItem($user->id, $params['itemId']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function sellItem($params) {
        if ($params['token'] && $params['itemId']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->itemManager->sellItem($user->id, $params['itemId']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function checkBowAndArrows($params) {
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->itemManager->checkBowAndArrows($user->id);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function consumeArrow($params) {
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->itemManager->consumeArrow($user->id);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    //Game
    public function getScene($params) {
        if ($params['roomId'] && $params['characterHash'] && $params['botHash'] && $params['arrowHash']) {
            return $this->game->getScene($params['roomId'], $params['characterHash'], $params['botHash'], $params['arrowHash']);
        }
        return ['error' => 242];
    }

    public function getBots($params) {
        if ($params['roomId']) {
            return $this->game->getBots($params['roomId']);
        }
        return ['error' => 242];
    }

    public function getBotsData($params) {
        return $this->game->getBotsData();
    }

    public function getArrows($params) {
        if ($params['roomId']) {
            return $this->game->getArrows($params['roomId']);
        }
        return ['error' => 242];
    }

    public function updateCharacter($params) {
        if ($params['token'] && $params['characterData']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->game->updateCharacter($user->id, $params['characterData']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function updateBots($params) {
        if ($params['token'] && $params['botsData']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->game->updateBots($user->id, $params['botsData']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function updateArrows($params) {
        if ($params['token'] && $params['arrowsData']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->game->updateArrows($user->id, $params['arrowsData']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function addMoneyForKill($params) {
        if ($params['token'] && $params['killerToken'] && $params['botTypeId']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->game->addMoneyForKill($user->id, $params['killerToken'], $params['botTypeId']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }
}
