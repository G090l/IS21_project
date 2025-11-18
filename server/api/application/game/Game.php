<?php

class Game {
    private $db;

    function __construct($db) { 
        $this->db = $db;
    }

    //обновление данных персона
    public function updateCharacter($userId, $characterData) {
        //проверка, существует ли пользователь
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }

        //проверка, есть ли юзер в комнате
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        if (!$roomMember) {
            return ['error' => 2006];
        }

        //сохраняем данные и обновляем хеш
        $this->db->updateRoomMemberData($roomMember->id, $characterData);
        $this->db->updateCharacterHash(md5(rand()));
        
        return true;
    }

    //получение сцены
    public function getScene($roomId, $characterHash, $botHash, $arrowHash) {
        //проверка, есть ли комната
        $room = $this->db->getRoomById($roomId);
        if (!$room) {
            return ['error' => 2003];
        }

        $currentCharHash = $this->db->getCharacterHash();
        $currentBotHash = $this->db->getBotHash();
        $currentArrowHash = $this->db->getArrowHash();

        //если все хеши совпадают - данные не изменились
        if ($characterHash === $currentCharHash && 
            $botHash === $currentBotHash && 
            $arrowHash === $currentArrowHash) {
            return [
                'status' => 'unchanged',
                'game_status' => $room->status
            ];
        }

        //получение всех данных сцены
        $characters = $this->db->getAllRoomMembersWithData($roomId);
        $bots = $this->db->getBotsByRoomId($roomId);
        $arrows = $this->db->getArrowsByRoomId($roomId);

        return [
            'status' => 'updated',
            'game_status' => $room->status,
            'character_hash' => $currentCharHash,
            'bot_hash' => $currentBotHash,
            'arrow_hash' => $currentArrowHash,
            'characters' => $characters,
            'bots' => $bots,
            'arrows' => $arrows
        ];
    }

    //получение всех ботов в комнате
    public function getBots($roomId) {
        //проверка, что комната существует
        $room = $this->db->getRoomById($roomId);
        if (!$room) {
            return ['error' => 2003];
        }

        //получаем данные ботов
        $bots = $this->db->getBotsByRoomId($roomId);
        
        //проверка, есть ли боты в комнате
        if (!$bots) {
            return ['error' => 5005];
        }
        
        return $bots;
    }

    //получение всех данных ботов из таблицы
    public function getBotsData() {
        $bots = $this->db->getAllBotsData();
        return $bots;
    }

    //получение всех стрел в комнате
    public function getArrows($roomId) {
        //проверка, что комната существует
        $room = $this->db->getRoomById($roomId);
        if (!$room) {
            return ['error' => 2003];
        }

        //получаем все стрелы в комнате (массив объектов)
        $arrows = $this->db->getArrowsByRoomId($roomId);
        
        //проверка, есть ли стрелы в комнате
        if (!$arrows) {
            return ['error' => 6008];
        }
        
        return $arrows;
    }

    //обновление ботов
    public function updateBots($userId, $botsData) {
        //проверка, есть ли юзер
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }

        //проверка, является ли юзер овнером
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        if (!$roomMember || $roomMember->type !== 'owner') {
            return ['error' => 2010];
        }

        //проверка, что комната уже started
        $room = $this->db->getRoomById($roomMember->room_id);
        if (!$room || $room->status != 'started') {
            return ['error' => 2011];
        }

       //сохраняем данные и обновляем хеш
        $this->db->updateAllBotsInRoom($roomMember->room_id, $botsData);
        $this->db->updateBotHash(md5(rand()));
        
        return true;
    }

    //обновление стрел
    public function updateArrows($userId, $arrowsData) {
        //проверка, есть ли юзер
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }

        //проверка, является ли юзер овнером
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        if (!$roomMember || $roomMember->type !== 'owner') {
            return ['error' => 2010];
        }

        //проверка, что комната уже started
        $room = $this->db->getRoomById($roomMember->room_id);
        if (!$room || $room->status != 'started') {
            return ['error' => 2011];
        }

        //сохраняем данные и обновляем хеш
        $this->db->updateAllArrowsInRoom($roomMember->room_id, $arrowsData);
        $this->db->updateArrowHash(md5(rand()));
        
        return true;
    }

    //получение денег за убийство бота
    public function addMoneyForKill($userId, $killerToken, $botTypeId) {
        // Проверка, существует ли овнер
        $owner = $this->db->getUserById($userId);
        if (!$owner) {
            return ['error' => 705];
        }

        // Проверка, является ли овнером комнаты
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        if (!$roomMember || $roomMember->type !== 'owner') {
            return ['error' => 2010];
        }

        // Проверка, что комната уже started
        $room = $this->db->getRoomById($roomMember->room_id);
        if (!$room || $room->status != 'started') {
            return ['error' => 2011];
        }

        // Проверка убийцы
        $killerUser = $this->db->getUserByToken($killerToken);
        if (!$killerUser) {
            return ['error' => 705];
        }

        // Проверка, что убийца в комнате
        $killerRoomMember = $this->db->getRoomMemberByUserId($killerUser->id);
        if (!$killerRoomMember || $killerRoomMember->room_id != $roomMember->room_id) {
            return ['error' => 2006];
        }

        // Получаем данные типа бота для награды
        $botType = $this->db->getBotTypeById($botTypeId);
        if (!$botType) {
            return ['error' => 5001];
        }

        // Получаем персонажа убийцы
        $killerCharacter = $this->db->getCharacterByUserId($killerUser->id);
        if (!$killerCharacter) {
            return ['error' => 706];
        }

        // Начисляем деньги 
        $reward = $botType->money;
        if ($reward > 0) {
            $this->db->updateCharacterMoneyAdd($killerCharacter->id, $reward);
        }

        return true;
    }
}