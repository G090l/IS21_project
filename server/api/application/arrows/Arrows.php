<?php

class Arrows {
    private $db;

    function __construct($db) { 
        $this->db = $db;
    }

    //создание стрелы в комнате
    public function spawnArrow($userId, $x, $y, $creatorToken) {
        //проверка, существует ли юзер
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }

        //проверка, есть ли юзер в комнате
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        if (!$roomMember) {
            return ['error' => 2006];
        }

        //проверка, что юзер является овнером
        if ($roomMember->type !== 'owner') {
            return ['error' => 2010];
        }

        //проверка, что комната есть и игра started
        $room = $this->db->getRoomById($roomMember->room_id);
        if (!$room || $room->status != 'started') {
            return ['error' => 2011];
        }

        //проверка создателя стрелы
        $creatorUser = $this->db->getUserByToken($creatorToken);
        if (!$creatorUser) {
            return ['error' => 6001]; 
        }

        //проверка, что создатель находится в комнате
        $creatorRoomMember = $this->db->getRoomMemberByUserId($creatorUser->id);
        if (!$creatorRoomMember || $creatorRoomMember->room_id != $roomMember->room_id) {
            return ['error' => 6002];
        }

        //получаем персонажа создателя стрелы
        $creatorCharacter = $this->db->getCharacterByUserId($creatorUser->id);
        if (!$creatorCharacter) {
            return ['error' => 706];
        }

        //проверка, что у персонажа есть лук
        $hasBow = $this->db->hasCharacterWeaponType($creatorCharacter->id, 'bow');
        if (!$hasBow) {
            return ['error' => 6006];
        }

        //проверка, что у персонажа есть стрелы
        $hasArrows = $this->db->hasCharacterArrows($creatorCharacter->id);
        if (!$hasArrows) {
            return ['error' => 6007];
        }

        //получаем направление персонажа
        if (!$creatorRoomMember->direction) {
            return ['error' => 6005]; 
        }
        $creatorDirection = $creatorRoomMember->direction;

        //проверка координат
        if (!is_numeric($x) || !is_numeric($y)) {
            return ['error' => 6003];
        }

        //вычитаем одну стрелу у персонажа и создаем её в комнате
        $arrowConsumed = $this->db->consumeCharacterArrow($creatorCharacter->id);
        $arrowSpawned = $this->db->addArrowToRoom($roomMember->room_id, $creatorCharacter->id, $x, $y, $creatorDirection);
        return true;
    }

    //обновление состояния стрелы
    public function updateArrow($userId, $arrowId, $x, $y) {
        //проверка, существует ли юзер
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }

        //проверка, есть ли юзер в комнате
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        if (!$roomMember) {
            return ['error' => 2006];
        }

        //проверка, что юзер является овнером
        if ($roomMember->type !== 'owner') {
            return ['error' => 2010];
        }

        //проверка, что стрела существует в этой комнате
        $arrow = $this->db->getArrowById($arrowId);
        if (!$arrow || $arrow->room_id != $roomMember->room_id) {
            return ['error' => 6004];
        }

        //проверка координат
        if (!is_numeric($x) || !is_numeric($y)) {
            return ['error' => 6003];
        }

        //обновляем данные стрелы
        $arrowUpdated = $this->db->updateArrowData($arrowId, $x, $y);
        return true;
    }

    //удаление стрелы из комнаты
    public function removeArrow($userId, $arrowId) {
        //проверка, существует ли юзер
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }

        //проверка, есть ли юзер в комнате
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        if (!$roomMember) {
            return ['error' => 2006];
        }

        //проверка, что юзер является овнером
        if ($roomMember->type !== 'owner') {
            return ['error' => 2010];
        }

        //проверка, что стрела существует в этой комнате
        $arrow = $this->db->getArrowById($arrowId);
        if (!$arrow || $arrow->room_id != $roomMember->room_id) {
            return ['error' => 6004];
        }

        //удаляем стрелу
        $arrowRemoved = $this->db->removeArrowFromRoom($arrowId);
        return true;
    }

    //получение всех стрел в комнате
    public function getArrows($roomId) {
        //проверка, что комната существует
        $room = $this->db->getRoomById($roomId);
        if (!$room) {
            return ['error' => 2003];
        }

        //получаем всех стрел в комнате
        $arrows = $this->db->getArrowsByRoomId($roomId);
        
        //проверка, есть ли стрелы в комнате
        if (!$arrows || count($arrows) === 0) {
            return ['error' => 6008];
        }
        
        return $arrows;
    }
}