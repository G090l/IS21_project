<?php

class LobbyManager extends BaseManager {
    
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
        //проверка пользователя
        $user = $this->checkUserExists($userId);
         if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;
        
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

        //проверка размера комнаты
        if ($roomSize < ROOM_MIN_SIZE || $roomSize > ROOM_MAX_SIZE) {
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
        //проверка пользователя
        $user = $this->checkUserExists($userId);
         if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;
        
        //проверка, есть ли такая комната
        $room = $this->db->getRoomById($roomId);
        if (!$room) {
            return ['error' => 2003];
        }
        
        //проверка, что комната открыта
        if ($room->status != 'open') {
            return ['error' => 2005];
        }

        //если юзер уже играет (started) --> error
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
            if ($currentRoomMember && $currentRoomMember->roomId == $roomId) {
                return ['error' => 2004];
            }
            $this->leaveParticipantFromRoom($userId);
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
        //проверка пользователя
        $user = $this->checkUserExists($userId);
         if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;

        //проверка, что пользователь в комнате
        $roomMember = $this->checkUserInRoom($userId);
        if (is_array($roomMember)) return $roomMember;
        
        $userType = $this->getUserTypeInRoom($userId);
        
        //если юзер === 'owner', то комната распускается, а если юзер НЕ 'owner', то он удалется из комнаты
        if ($userType === 'owner') {
            if ($roomMember) {
                //удаляем всех участников комнаты и саму комнату
                $this->db->deleteAllRoomMembers($roomMember->roomId);
                $this->db->deleteRoom($roomMember->roomId);
            }
        } else {
            $this->leaveParticipantFromRoom($userId);
            
            //открываем комнату после выхода участника
            $this->db->updateRoomStatus($roomMember->roomId, 'open');
        }
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function dropFromRoom($userId, $targetToken) {
        //проверка пользователя
        $user = $this->checkUserExists($userId);
         if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;

        //проверка, что пользователь является владельцем
        $roomMember = $this->checkUserIsRoomOwner($userId);
        if (is_array($roomMember)) return $roomMember;
        
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
        if (!$targetRoomMember || $targetRoomMember->roomId != $roomMember->roomId) {
            return ['error' => 2009];
        }
        
        // кикаем участника
        $this->db->leaveParticipantFromRoom($targetId);
        
        //открываем комнату после кика участника
        $this->db->updateRoomStatus($roomMember->roomId, 'open');
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function startGame($userId) {
        //проверка пользователя
        $user = $this->checkUserExists($userId);
        if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;

        //проверка, что пользователь является владельцем
        $roomMember = $this->checkUserIsRoomOwner($userId);
        if (is_array($roomMember)) return $roomMember;
        
        //получаем комнату
        $room = $this->db->getRoomById($roomMember->roomId);
        if (!$room) {
            return ['error' => 2003];
        }
        
        //проверка статуса комнаты - должна быть закрыта
        if ($room->status != 'closed') {
            return ['error' => 2015];
        }
        
        //получаем всех участников комнаты
        $roomMembers = $this->db->getAllRoomMembers($roomMember->roomId);
        
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
        $this->db->updateRoomStatus($roomMember->roomId, 'started');
        $this->db->updateAllRoomMembersStatus($roomMember->roomId, 'started');
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    public function renameRoom($userId, $newRoomName) {
        //проверка пользователя
        $user = $this->checkUserExists($userId);
         if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;
        
        //проверка, что пользователь является владельцем
        $roomMember = $this->checkUserIsRoomOwner($userId);
        if (is_array($roomMember)) return $roomMember;
        
        //проверка существования комнаты
        $room = $this->db->getRoomById($roomMember->roomId);
        if (!$room) {
            return ['error' => 2003];
        }
        
        //обновляем имя комнаты
        $roomRenamed = $this->db->updateRoomName($roomMember->roomId, $newRoomName);
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
        
        //получаем все открытые и закрытые комнаты
        $rooms = $this->db->getOpenAndClosedRooms();
        
        //инфа о пользователях для каждой комнаты
        $roomsWithMembers = [];
        foreach ($rooms as $room) {
            $members = $this->db->getAllRoomMembersWithUserInfo($room['id']);
            $roomsWithMembers[] = [
                'id' => $room['id'],
                'name' => $room['name'],
                'status' => $room['status'],
                'roomSize' => $room['roomSize'],
                'playersCount' => $room['playersCount'],
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