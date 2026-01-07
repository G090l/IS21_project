<?php

class GameManager extends BaseManager {
    
    //обновление данных персонажа
    public function updateCharacter($userId, $characterData) {
        //проверка пользователя
        $user = $this->checkUserExists($userId);
         if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;
        
        //проверка, что пользователь в комнате
        $roomMember = $this->checkUserInRoom($userId);
        if (is_array($roomMember)) return $roomMember;
        
        //проверка статуса комнаты
        $room = $this->checkRoomIsStarted($roomMember->roomId);
        if (is_array($room)) return $room;

        //сохраняем данные и обновляем хеш
        $this->db->updateRoomMemberData($roomMember->id, $characterData);
        $this->db->updateCharacterHash(md5(rand()));
        
        return true;
    }
    
    //получение сцены
    public function getScene($userId, $characterHash, $botHash, $arrowHash) {
        //проверка пользователя
        $user = $this->checkUserExists($userId);
        if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;
        
        //проверка, что пользователь в комнате
        $roomMember = $this->checkUserInRoom($userId);
        if (is_array($roomMember)) return $roomMember;
        
        //получаем комнату
        $room = $this->db->getRoomById($roomMember->roomId);
        if (!$room) {
            return ['error' => 2003];
        }

        //получаем все хеши
        $sceneHashes = $this->db->getAllSceneHashes();
        $currentCharHash = $sceneHashes->characterHash;
        $currentBotHash = $sceneHashes->botHash;
        $currentArrowHash = $sceneHashes->arrowHash;

        $response = [
            'status' => 'unchanged',
            'gameStatus' => $room->status
        ];

        //если все хеши совпадают - данные не изменились
        if (
            $characterHash === $currentCharHash && 
            $botHash === $currentBotHash && 
            $arrowHash === $currentArrowHash
        ) {
            return $response;
        }

        $response['status'] = 'updated';
        if ($characterHash !== $currentCharHash) {
            $characters = $this->db->getAllRoomMembersWithData($roomMember->roomId);
            //класс для каждого перса
            foreach ($characters as &$character) {
                if (isset($character['userId'])) {
                    $selectedClass = $this->db->getUserSelectedClassId($character['userId']);
                    $character['selectedClass'] = $selectedClass;
                }
            }
            $response['characterHash'] = $currentCharHash;
            $response['characters'] = $characters;
        }
        if ($botHash !== $currentBotHash) {
            $response['botHash'] = $currentBotHash;
            $response['botsData'] = $this->db->getBotsByRoomId($roomMember->roomId);
        }
        if ($arrowHash !== $currentArrowHash) {
            $response['arrowHash'] = $currentArrowHash;
            $response['arrowsData'] = $this->db->getArrowsByRoomId($roomMember->roomId);
        }
        return $response;
    }
    
    //получение всех данных ботов из таблицы
    public function getBotsData() {
        $bots = $this->db->getAllBotsData();
        return $bots;
    }
    
    //обновление ботов
    public function updateBots($userId, $botsData) {
        //проверка пользователя
        $user = $this->checkUserExists($userId);
         if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;

        //проверка, что пользователь в комнате
        $roomMember = $this->checkUserInRoom($userId);
        if (is_array($roomMember)) return $roomMember;
        
        //проверка статуса комнаты
        $room = $this->checkRoomIsStarted($roomMember->roomId);
        if (is_array($room)) return $room;
        
        //сохраняем данные и обновляем хеш
        $this->db->updateAllBotsInRoom($roomMember->roomId, $botsData);
        $this->db->updateBotHash(md5(rand()));
        
        return true;
    }
    
    //обновление стрел
    public function updateArrows($userId, $arrowsData) {
        //проверка пользователя
        $user = $this->checkUserExists($userId);
         if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;

        //проверка, что пользователь в комнате
        $roomMember = $this->checkUserInRoom($userId);
        if (is_array($roomMember)) return $roomMember;
        
        //проверка статуса комнаты
        $room = $this->checkRoomIsStarted($roomMember->roomId);
        if (is_array($room)) return $room;
        
        //сохраняем данные и обновляем хеш
        $this->db->updateAllArrowsInRoom($roomMember->roomId, $arrowsData);
        $this->db->updateArrowHash(md5(rand()));
        
        return true;
    }
    
    //получение денег за убийство бота
    public function addMoneyForKill($userId, $killerToken, $botTypeId) {
        //проверка пользователя
        $user = $this->checkUserExists($userId);
         if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;
        
        //проверка пользователя и прав владельца
        $roomMember = $this->checkUserIsRoomOwner($userId);
        if (is_array($roomMember)) return $roomMember;
        
        //проверка статуса комнаты
        $room = $this->checkRoomIsStarted($roomMember->roomId);
        if (is_array($room)) return $room;
        
        //проверка существования убийцы
        $killerUser = $this->db->getUserByToken($killerToken);
        if (!$killerUser) {
            return ['error' => 705];
        }

        //проверка, что убийца в комнате
        $killerRoomMember = $this->db->getRoomMemberByUserId($killerUser->id);
        if (!$killerRoomMember || $killerRoomMember->roomId != $roomMember->roomId) {
            return ['error' => 2006];
        }

        //получаем данные типа бота для награды
        $botType = $this->db->getBotTypeById($botTypeId);
        if (!$botType) {
            return ['error' => 5001];
        }

        //получаем персонажа убийцы
        $killerCharacter = $this->db->getCharacterByUserId($killerUser->id);
        if (!$killerCharacter) {
            return ['error' => 706];
        }

        //начисляем деньгу
        $reward = $botType->money;
        if ($reward > 0) {
            $this->db->updateCharacterMoneyAdd($killerCharacter->id, $reward);
        }

        return true;
    }
}