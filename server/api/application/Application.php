<?php
require_once ('db/DB.php');
require_once ('user/User.php');
require_once ('chat/Chat.php');
require_once ('math/Math.php');
require_once ('lobby/Lobby.php');
require_once('menu/Menu.php');
require_once('shop/Shop.php');
require_once('bots/Bots.php');

class Application {
    function __construct() {
        $db = new DB();
        $this->user = new User($db);
        $this->math = new Math();
        $this->lobby = new Lobby($db);
        $this->menu = new Menu($db);
        $this->chat = new Chat($db);
        $this->shop = new Shop($db);
        $this->bots = new Bots($db);
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

    //lobby
    public function createRoom($params) {
        if ($params['token']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->lobby->createRoom($user->id);
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
    //menu
    public function getUserInfo($params) {
        if (!empty($params['token'])) {
            $user = $this->user->getUser($params['token']);
            if ($user) return $this->menu->getUserInfo($user->id);
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function getClasses($params) {
        return $this->menu->getClasses();
    }

    public function getUserOwnedClasses($params) {
        if (!empty($params['token'])) {
            $user = $this->user->getUser($params['token']);
            if ($user) return $this->menu->getUserOwnedClasses($user->id);
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function buyClass($params) {
        if (!empty($params['token']) && !empty($params['classId'])) {
            $user = $this->user->getUser($params['token']);
            if ($user) return $this->menu->buyClass($user->id, $params['classId']);
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function selectClass($params) {
        if (!empty($params['token']) && !empty($params['classId'])) {
            $user = $this->user->getUser($params['token']);
            if ($user) return $this->menu->selectClass($user->id, $params['classId']);
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    //shop
    public function buyItem($params) {
        if ($params['token'] && $params['itemId']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->shop->buyItem($user->id, $params['itemId']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function sellItem($params) {
        if ($params['token'] && $params['itemId']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->shop->sellItem($user->id, $params['itemId']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    //bots
    public function spawnBot($params) {
        if ($params['token'] && $params['botType'] && $params['botData']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                $botData = json_decode($params['botData'], true);
                if (!$botData) {
                    return ['error' => 5003];
                }
                return $this->bots->spawnBot($user->id, $params['botType'], $botData);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function getBots($params) {
        if ($params['roomId']) {
            return $this->bots->getBotsInRoom($params['roomId']);
        }
        return ['error' => 242];
    }

    public function updateBot($params) {
        if ($params['token'] && $params['botId'] && $params['botData']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                $botData = json_decode($params['botData'], true);
                if (!$botData) {
                    return ['error' => 5003];
                }
                return $this->bots->updateBot($user->id, $params['botId'], $botData);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }

    public function removeBot($params) {
        if ($params['token'] && $params['botId']) {
            $user = $this->user->getUser($params['token']);
            if ($user) {
                return $this->bots->removeBot($user->id, $params['botId']);
            }
            return ['error' => 705];
        }
        return ['error' => 242];
    }
}
