<?php

class Bots {
    private $db;

    function __construct($db) { 
        $this->db = $db;
    }

    //проверка влетающего json'a
    private function isValidBotData($botData) {
        if (!is_array($botData)) {
            return false;
        }

        //проверка на наличие влетающих хп и координат
        $requiredFields = ['hp', 'x', 'y'];
        foreach ($requiredFields as $field) {
            if (!isset($botData[$field]) || !is_numeric($botData[$field])) {
                return false;
            }
        }

        return true;
    }

    //спавн бота
    public function spawnBot($userId, $botType, $botData) {

        //проверка, существует ли юзер
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }

        //проверка, есть ли у юзера персонаж
        $character = $this->db->getCharacterByUserId($userId);
        if (!$character) {
            return ['error' => 706];
        }

        //проверка, есть ли юзер в комнате
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        if (!$roomMember) {
            return ['error' => 2008];
        }

        //проверка, что юзер является овнером
        if ($roomMember->type !== 'owner') {
            return ['error' => 2018];
        }

        //проверка, что комната есть и игра started
        $room = $this->db->getRoomById($roomMember->room_id);
        if (!$room || $room->status != 'started') {
            return ['error' => 2017];
        }

        //проверка типа бота
        $bot = $this->db->getBotByName($botType);
        if (!$bot) {
            return ['error' => 5001];
        }

        //проверка формата данных бота
        if (!$this->isValidBotData($botData)) {
            return ['error' => 5003];
        }

        //игнорируем хп от клиента и берем его из таблицы bots
        $botData['hp'] = $bot->hp;
    
        //спавним бота в комнате
        $botSpawned = $this->db->addBotToRoom($roomMember->room_id, $bot->id, $botData);
        if (!$botSpawned) {
            return ['error' => 5002];
        }

        return true;
    }

    //получение всех ботов в комнате
    public function getBots($roomId) {
        //проверка, что комната существует
        $room = $this->db->getRoomById($roomId);
        if (!$room) {
            return ['error' => 2003];
        }

        //получаем всех ботов в комнате
        $bots = $this->db->getBotsByRoomId($roomId);
        
        //проверка, есть ли боты в комнате
        if (!$bots || count($bots) === 0) {
            return ['error' => 5005];
        }
        
        return $bots;
    }

    //обновление данных бота
    public function updateBot($userId, $botId, $botData) {
        //проверка, существует ли юзер
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }

        //проверка, есть ли юзер в комнате
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        if (!$roomMember) {
            return ['error' => 2008]; 
        }

        //проверка, что юзер является овнером комнаты
        if ($roomMember->type !== 'owner') {
            return ['error' => 2018]; 
        }

        //проверка, что бот существует в этой комнате
        $bot = $this->db->getBotById($botId);
        if (!$bot || $bot->room_id != $roomMember->room_id) {
            return ['error' => 5004];
        }

        //проверка формата данных бота
        if (!$this->isValidBotData($botData)) {
            return ['error' => 5003];
        }

        //если хп бота = 0 или меньше - удаляем бота
        if ($botData['hp'] <= 0) {
            return $this->removeBot($userId, $botId);
        }

        //обновляем данные бота
        $botUpdated = $this->db->updateBotData($botId, $botData);
        if (!$botUpdated) {
            return ['error' => 5002];
        }

        return true;
    }

    //удаление бота из комнаты
    public function removeBot($userId, $botId) {
        //проверка, существует ли юзер
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }

        //проверка, есть ли юзер в комнате
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        if (!$roomMember) {
            return ['error' => 2008];
        }

        //проверка, что юзер является овнером
        if ($roomMember->type !== 'owner') {
            return ['error' => 2018]; 
        }

        //проверка, что бот существует в этой комнате
        $bot = $this->db->getBotById($botId);
        if (!$bot || $bot->room_id != $roomMember->room_id) {
            return ['error' => 5004];
        }

        //удаляем бота
        $botRemoved = $this->db->removeBotFromRoom($botId);
        if (!$botRemoved) {
            return ['error' => 5002];
        }

        return true;
    }
}