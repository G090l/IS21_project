<?php

class BaseManager {
    protected $db;
    
    function __construct($db) { 
        $this->db = $db;
    }
    
    //Проверка существования пользователя по ID
    protected function checkUserExists($userId) {
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }
        return $user;
    }
    
    //Проверка существования персонажа у пользователя
    protected function checkCharacterExists($userId) {
        $character = $this->db->getCharacterByUserId($userId);
        if (!$character) {
            return ['error' => 706];
        }
        return $character;
    }
    
    //Проверка, что пользователь является владельцем комнаты
    protected function checkUserIsRoomOwner($userId) {
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        
        // Проверка, что пользователь в комнате и является владельцем
        if (!$roomMember || $roomMember->type !== 'owner') {
            return ['error' => 2010];
        }
        
        return $roomMember;
    }
    
    //Проверка, что комната имеет статус "started"
    protected function checkRoomIsStarted($roomId) {
        $room = $this->db->getRoomById($roomId);
        
        // Проверка существования комнаты и её статуса
        if (!$room || $room->status != 'started') {
            return ['error' => 2011];
        }
        
        return $room;
    }
    
    //Проверка, что пользователь находится в комнате
    protected function checkUserInRoom($userId) {
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        
        if (!$roomMember) {
            return ['error' => 2006];
        }
        
        return $roomMember;
    }
    
}