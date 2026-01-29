<?php

class UserManager extends BaseManager {
    
    public function getUser($token) {
        return $this->db->getUserByToken($token);
    }
    
    public function getUserInfo($userId) {
        $user = $this->checkUserExists($userId);
        if (is_array($user) && isset($user['error'])) {
            return $user; 
        }

        $character = $this->checkCharacterExists($userId);
        if (is_array($character) && isset($character['error'])) {
            return $character;
        }

        //инфа о классах юзера
        $selectedClass = $this->db->getUserSelectedClassId($userId);
        $purchasedClasses = $this->db->getUserPurchasedClassIds($userId);

         //инфа о предметах юзера
        $purchasedItems = $this->db->getUserPurchasedItemsWithQuantity($character->id);

        return [
            'characterId' => $character->id,
            'userId' => $user->id,
            'login' => $user->login,
            'nickname' => $user->nickname,
            'money' => $character->money,
            'selectedClass' => $selectedClass, 
            'purchasedClasses' => $purchasedClasses,
            'purchasedItems' => $purchasedItems
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

        /****Создание персонажа с базовым классом и стандартыми предметами****/ 
        $newUser = $this->db->getUserByLogin($login);
        if (!$newUser) {
            return ['error' => 705];
        }
        
        $characterCreated = $this->db->createCharacter($newUser->id);
        if (!$characterCreated) {
            return ['error' => 1007];
        }
        
        $classAdded = $this->db->addUserPersonClass($newUser->id, STARTED_CLASS_ID);
        if (!$classAdded) {
            return ['error' => 1008];
        }
        
        $classSelected = $this->db->setUserSelectedPersonClass($newUser->id, STARTED_CLASS_ID);
        if (!$classSelected) {
            return ['error' => 1009];
        }

        $character = $this->checkCharacterExists($newUser->id);
        if (is_array($character)) return $character;

        foreach (STARTED_ITEMS as $itemId) {
            $itemAdded = $this->db->addUserItem($character->id, $itemId);
        }
        /********************************************/ 

        $rnd = round(rand() * PASSWORD_SALT_LENGTH);
        $passwordHash = md5($password . $rnd);
        
        return $this->login($login, $passwordHash, $rnd);
    }

    //возвращает возвращает 20 самых крутых пользаков с самым БОЛЬШИМ ...
    public function getRatingTable() {
        return $this->db->getRatingTable();
    }
    
    public function deleteUser($token) {
        $user = $this->db->getUserByToken($token);
        if (!$user) {
            return ['error' => 705]; 
        }
        
        //создание временного объекта Lobby для вызова leaveRoom (мало ли юзер овнер)
        $userType = $this->db->getUserTypeInRoom($user->id);
        if ($userType) {
            $lobby = new LobbyManager($this->db);
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
