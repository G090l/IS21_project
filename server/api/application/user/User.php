<?php
require_once('application/Config.php');

class User {
    function __construct($db) {
        $this->db = $db;
    }

    public function getUser($token) {
        return $this->db->getUserByToken($token);
    }
    
    public function getUserInfo($userId) {
        $user = checkUser($this->db, $userId);
        if (!$user) return Answer::error(705);

        $character = checkCharacter($this->db, $userId);
        if (!$character) return Answer::error(706);

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
            return Answer::error(1002);
        }
        return Answer::error(705);
    }

    public function logout($token) {
        $user = checkUserByToken($this->db, $token);
        if (!$user) return Answer::error(705);
        $this->db->updateToken($user->id, null);
        return true;
    }

    public function registration($login, $password, $nickname) {
        $user = $this->db->getUserByLogin($login);
        if ($user) return Answer::error(1001);

        $this->db->registration($login, $password, $nickname);

        /****Создание персонажа с базовым классом****/
        $newUser = checkUserByLogin($this->db, $login);
        if (!$newUser) return Answer::error(705);
        
        $characterCreated = $this->db->createCharacter($newUser->id);
        if (!$characterCreated) return Answer::error(1007);
        
        $classAdded = $this->db->addUserPersonClass($newUser->id, 1);
        if (!$classAdded) return Answer::error(1008);
        
        $classSelected = $this->db->setUserSelectedPersonClass($newUser->id, 1);
        if (!$classSelected) return Answer::error(1009);
        /********************************************/ 

        $rnd = round(rand() * 100000);
        $passwordHash = md5($password . $rnd);
        
        return $this->login($login, $passwordHash, $rnd);
    }

    public function deleteUser($token) {
        $user = checkUserByToken($this->db, $token);
        if (!$user) return Answer::error(705);

        // выход из комнаты, если есть
        $userType = $this->db->getUserTypeInRoom($user->id);
        if ($userType) {
            $lobby = new Lobby($this->db);
            $leaveResult = $lobby->leaveRoom($user->id);
            if (!$leaveResult) return Answer::error(2012);
        }

        // удаление персонажа и связанного контента
        $character = checkCharacter($this->db, $user->id);
        if ($character) {
            $characterId = $character->id;
            $this->db->deleteAllCharacterItems($characterId);
            $this->db->deleteAllCharacterClasses($characterId);
            $this->db->deleteCharacter($user->id);
        }

        $this->db->deleteUserMessages($user->id);

        $success = $this->db->deleteUser($user->id);
        if ($success) return true;

        return Answer::error(2012); 
    }
}
