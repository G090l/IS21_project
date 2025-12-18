<?php
require_once ('BaseManager.php');
require_once ('db/DB.php');
require_once ('userManager/UserManager.php');
require_once ('chatManager/ChatManager.php');
require_once ('mathManager/MathManager.php');
require_once ('lobbyManager/LobbyManager.php');
require_once('classManager/ClassManager.php');
require_once('itemManager/ItemManager.php');
require_once('gameManager/GameManager.php');

class Application {
    function __construct() {
        $db = new DB();
        $this->user = new UserManager($db);
        $this->math = new MathManager();
        $this->lobby = new LobbyManager($db);
        $this->class = new ClassManager($db);
        $this->chat = new ChatManager($db);
        $this->item = new ItemManager($db);
        $this->game = new GameManager($db);
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

    //ChatManager
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

    //LobbyManager
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
        if ($params['token'] && $params['roomHash']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->lobby->getRooms($params['roomHash']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function endGame($params) {
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->lobby->endGame($user->id);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    //ClassManager
    public function getClasses($params) {
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->class->getClasses();
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function buyClass($params) {
        if (!empty($params['token']) && !empty($params['classId'])) {
            $user = $this->user->getUser($params['token']);
            if ($user) return $this->class->buyClass($user->id, $params['classId']);
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function selectClass($params) {
        if (!empty($params['token']) && !empty($params['classId'])) {
            $user = $this->user->getUser($params['token']);
            if ($user) return $this->class->selectClass($user->id, $params['classId']);
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    //ItemManager
    public function buyItem($params) {
        if ($params['token'] && $params['itemId']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->item->buyItem($user->id, $params['itemId']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function sellItem($params) {
        if ($params['token'] && $params['itemId']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->item->sellItem($user->id, $params['itemId']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function useArrow($params) {
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->item->useArrow($user->id);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function usePotion($params) {
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->item->usePotion($user->id);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function getItemsData($params) {
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->item->getItemsData();
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    //GameManager
    public function getScene($params) {
        if ($params['token'] && $params['characterHash'] && $params['botHash'] && $params['arrowHash']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->game->getScene($user->id, $params['characterHash'], $params['botHash'], $params['arrowHash']);
            }
            return ['error' => 705];
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
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->game->getBotsData();
            }
            return ['error' => 705];
        }
        return ['error' => 242];
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
