<?php

class Lobby {
    function __construct($db) { 
        $this->db = $db;
    }

    private function isUserPlaying($userId) {
        return boolval($this->db->isUserPlaying($userId));
    }

    private function getUserTypeInRoom($userId) {
        $user = $this->db->getUserTypeInRoom($userId);
        if ($user) {
            return $user->type;
        }
        return false;
    }

    private function leaveParticipantFromRoom($userId) {
        $this->db->leaveParticipantFromRoom($userId);
    }

    public function createRoom($userId, $roomName, $roomSize) {
        //если юзер уже играет (started) --> error
        if ($this->isUserPlaying($userId)) {
            return ['error' => 2001];
        }
        $userType = $this->getUserTypeInRoom($userId);
        
        //если комната уже создана (owner) --> error
        if ($userType === 'owner') {
            return ['error' => 2002];
        }

        //если юзер является участником другой комнаты (ready) --> leave & create
        if ($userType === 'participant') {
            $this->leaveParticipantFromRoom($userId);
        }

        //информация о пользователе
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }

        //проверка размера комнаты
        if ($roomSize < 1 || $roomSize > 6) {
            return ['error' => 2013];
        }

        //создаем комнату
        $roomId = $this->db->createRoom($userId, $roomName, $roomSize);
        
        //если комната на 1 игрока - сразу закрываем её
        if ($roomSize == 1) {
            $this->db->updateRoomStatus($roomId, 'closed');
        }
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function joinToRoom($roomId, $userId) { 
        //проверка, есть ли такая комната
        $room = $this->db->getRoomById($roomId);
        if (!$room) {
            return ['error' => 2003];
        }
        
        //проверка, что комната открыта
        if ($room->status != 'open') {
            return ['error' => 2005];
        }

        //проверка, если юзер уже играет (started) --> error
        if ($this->isUserPlaying($userId)) {
            return ['error' => 2001];
        }
        $userType = $this->getUserTypeInRoom($userId);

        //проверка, если комната уже уже создана юзером (owner) --> error
        if ($userType === 'owner') {
            return ['error' => 2002];
        }

        //если юзер является участником другой комнаты (ready) --> leave & create
        if ($userType === 'participant') {
            $currentRoomMember = $this->db->getRoomMemberByUserId($userId);
            if ($currentRoomMember && $currentRoomMember->room_id == $roomId) {
                return ['error' => 2004];
            }
            $this->leaveParticipantFromRoom($userId);
        }
        
        // Получаем character_id пользователя
        $character = $this->db->getCharacterByUserId($userId);
        if (!$character) {
            return ['error' => 706]; 
        }
        
        //добавляем перса в комнату
        $this->db->addRoomMember($roomId, $character->id, 'participant');
        
        //проверяем, заполнилась ли комната
        $roomMembers = $this->db->getAllRoomMembers($roomId);
        if (count($roomMembers) >= $room->room_size) {
            $this->db->updateRoomStatus($roomId, 'closed');
        }
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function leaveRoom($userId) {
        $userType = $this->getUserTypeInRoom($userId);
        
        //если юзер не в комнате, то ошибка
        if (!$userType) {
            return ['error' => 2006];
        }
        
        //получаем информацию о комнате пользователя
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        if (!$roomMember) {
            return ['error' => 2006];
        }
        
        //если юзер === 'owner', то комната распускается, а если юзер НЕ 'owner', то он удалется из комнаты
        if ($userType === 'owner') {
            if ($roomMember) {
                //удаляем всех участников комнаты и саму комнату
                $this->db->deleteAllRoomMembers($roomMember->room_id);
                $this->db->deleteRoom($roomMember->room_id);
            }
        } else {
            $this->leaveParticipantFromRoom($userId);
            
            //открываем комнату после выхода участника
            $this->db->updateRoomStatus($roomMember->room_id, 'open');
        }
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function dropFromRoom($userId, $targetToken) {
        //получаем инфу о юзере
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        
        //проверяем, что владелец вообще в комнате и является owner
        if (!$roomMember || $roomMember->type !== 'owner') {
            return ['error' => 2008];
        }
        
        //получаем цель по его токену
        $targetUser = $this->db->getUserByToken($targetToken);
        if (!$targetUser) {
            return ['error' => 705];
        }
        
        //находим его id
        $targetId = $targetUser->id;
        
        //проверяем, что владелец не пытается кикнуть себя
        if ($userId == $targetId) {
            return ['error' => 2007];
        }
        
        //получаем информацию о цели для кика в комнате
        $targetRoomMember = $this->db->getRoomMemberByUserId($targetId);
        
        //проверяем, что цель вообще находится в той же комнате
        if (!$targetRoomMember || $targetRoomMember->room_id != $roomMember->room_id) {
            return ['error' => 2009];
        }
        
        // кикаем участника
        $this->db->leaveParticipantFromRoom($targetId);
        
        //открываем комнату после кика участника
        $this->db->updateRoomStatus($roomMember->room_id, 'open');
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function startGame($userId) {
        //получаем инфу о юзере
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        
        //проверяем, что владелец вообще в комнате и является owner
        if (!$roomMember || $roomMember->type !== 'owner') {
            return ['error' => 2010];
        }
        
        //есть ли такая комната и закрыта ли она
        $room = $this->db->getRoomById($roomMember->room_id);
        if (!$room || $room->status != 'closed') {
            return ['error' => 2011]; 
        }
        
        //получаем всех участников комнаты
        $roomMembers = $this->db->getAllRoomMembers($roomMember->room_id);
        
        //проверка, есть ли в комнате хотя бы 1 пользователь со статусом ready
        $readyPlayers = 0;
        foreach ($roomMembers as $member) {
            if ($member['status'] === 'ready') {
                $readyPlayers++;
            }
        }
        
        //проверка на всех ready игроков
        if ($readyPlayers != $room->room_size) {
            return ['error' => 2012]; 
        }
        
        //меняем статус комнаты и участников на started
        $this->db->updateRoomStatus($roomMember->room_id, 'started');
        $this->db->updateAllRoomMembersStatus($roomMember->room_id, 'started');
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function renameRoom($userId, $newRoomName) {
        //получаем инфу о юзере
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        
        //проверяем, что владелец вообще в комнате и является owner
        if (!$roomMember || $roomMember->type !== 'owner') {
            return ['error' => 2010];
        }
        
        //есть ли такая комната
        $room = $this->db->getRoomById($roomMember->room_id);
        if (!$room) {
            return ['error' => 2003];
        }
        
        //обновляем имя комнаты
        $roomRenamed = $this->db->updateRoomName($roomMember->room_id, $newRoomName);
        if (!$roomRenamed) {
            return ['error' => 2014];
        }
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function getRooms($roomHash) {
        $currentHash = $this->db->getRoomHash();
        
        //если хэш совпадает, то данные не изменились
        if ($roomHash === $currentHash) {
            return ['status' => 'unchanged'];
        }
        
        //получаем все открытые комнаты
        $rooms = $this->db->getOpenRooms();
        
        //инфа о пользователях для каждой комнаты
        $roomsWithMembers = [];
        foreach ($rooms as $room) {
            $members = $this->db->getAllRoomMembersWithUserInfo($room['id']);
            $roomsWithMembers[] = [
                'id' => $room['id'],
                'name' => $room['name'],
                'status' => $room['status'],
                'room_size' => $room['room_size'],
                'players_count' => $room['players_count'],
                'members' => $members
            ];
        }
        
        return [
            'status' => 'updated',
            'hash' => $currentHash,
            'rooms' => $roomsWithMembers
        ];
    }

}