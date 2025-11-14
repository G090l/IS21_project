<?php

class User {
    function __construct($db) {
        $this->db = $db;
    }

    public function getUser($token) {
        return $this->db->getUserByToken($token);
    }
    
    public function getUserInfo($userId) {
        $user = $this->db->getUserById($userId);
        if (!$user) return ['error' => 705];

        $character = $this->db->getCharacterByUserId($userId);
        if (!$character) return ['error' => 706];

        return [
            'character_id' => $character->id,
            'user_id' => $user->id,
            'login' => $user->login,
            'nickname' => $user->nickname,
            'money' => $character->money
        ];
    }

    public function login($login, $password, $rnd) {
        $user = $this->db->getUserByLogin($login);
        if ($user) {
            if ($password == md5($user->password . $rnd)) {
                $token = md5(rand());
                $this->db->updateToken($user->id, $token);
                return [
                    'id' => $user->id,
                    'nickname' => $user->nickname,
                    'token' => $token
                ];
            }
            return ['error' => 1002];
        }
        return ['error' => 1005];
    }

    public function logout($token) {
        $user = $this->db->getUserByToken($token);
        if ($user) {
            $this->db->updateToken($user->id, null);
            return true;
        }
        return ['error' => 1003];
    }

    public function registration($login, $password, $nickname) {
        $user = $this->db->getUserByLogin($login);
        if ($user) {
            return ['error' => 1001];
        }
        $this->db->registration($login, $password, $nickname);

        /****Создание персонажа с базовым классом****/ 
        $newUser = $this->db->getUserByLogin($login);
        if (!$newUser) {
            return ['error' => 705];
        }
        
        $characterCreated = $this->db->createCharacter($newUser->id);
        if (!$characterCreated) {
            return ['error' => 1007];
        }
        
        $classAdded = $this->db->addUserPersonClass($newUser->id, 1);
        if (!$classAdded) {
            return ['error' => 1008];
        }
        
        $classSelected = $this->db->setUserSelectedPersonClass($newUser->id, 1);
        if (!$classSelected) {
            return ['error' => 1009];
        }
        /********************************************/ 

        $rnd = round(rand() * 100000);
        $passwordHash = md5($password . $rnd);
        
        return $this->login($login, $passwordHash, $rnd);
    }

    
    public function deleteUser($token) {
        $user = $this->db->getUserByToken($token);
        if (!$user) {
            return ['error' => 705]; 
        }
        
        //создание временного объекта Lobby для вызова leaveRoom (мало ли юзер овнер)
        $userType = $this->db->getUserTypeInRoom($user->id);
        if ($userType) {
            $lobby = new Lobby($this->db);
            $leaveResult = $lobby->leaveRoom($user->id);
            if (isset($leaveResult['error'])) {
                return $leaveResult;
            }
        }
        
        //последовательно убиваем все связанные данные в других таблицах
        $character = $this->db->getCharacterByUserId($user->id);
        if ($character) {
            $characterId = $character->id;
            
            $this->db->deleteAllCharacterItems($characterId);
            $this->db->deleteAllCharacterClasses($characterId);
            $this->db->deleteCharacter($user->id);
        }
        
        $this->db->deleteUserMessages($user->id);
        
        $success = $this->db->deleteUser($user->id);
        if ($success) {
            return true;
        }
        return ['error' => 2012]; 
    }
}
