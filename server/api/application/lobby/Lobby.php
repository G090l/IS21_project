<?php
require_once('application/Config.php');

class Lobby {
    function __construct($db) { 
        $this->db = $db;
    }

    // проверка, играет ли юзер
    private function isUserPlaying($userId) {
        return boolval($this->db->isUserPlaying($userId));
    }

    // получение типа пользователя в комнате
    private function getUserTypeInRoom($userId) {
        $user = $this->db->getUserTypeInRoom($userId);
        if ($user && isset($user->type)) {
            return $user->type;
        }
        return false;
    }

    // удаление участника из комнаты
    private function leaveParticipantFromRoom($userId) {
        $this->db->leaveParticipantFromRoom($userId);
    }

    // создание комнаты
    public function createRoom($userId, $roomName, $roomSize) {
        // если юзер уже играет (started) --> error
        if ($this->isUserPlaying($userId)) return Answer::error(2001);

        $userType = $this->getUserTypeInRoom($userId);
        
        // если комната уже создана (owner) --> error
        if ($userType === 'owner') return Answer::error(2002);

        // если юзер является участником другой комнаты (ready) --> leave & create
        if ($userType === 'participant') $this->leaveParticipantFromRoom($userId);

        // информация о пользователе
        $user = checkUser($this->db, $userId);

        // проверка размера комнаты
        if ($roomSize < 1 || $roomSize > 6) 
            return Answer::error(2013);

        // создаем комнату
        $roomId = $this->db->createRoom($userId, $roomName, $roomSize);
        
        // если комната на 1 игрока - сразу закрываем её
        if ($roomSize == 1) $this->db->updateRoomStatus($roomId, 'closed');
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    // присоединение к комнате
    public function joinToRoom($roomId, $userId) { 
        // проверка, есть ли такая комната
        $room = checkRoomExists($this->db, $roomId);
        
        // проверка, что комната открыта
        if (!isset($room->status) || $room->status != 'open') 
            return Answer::error(2005);

        // проверка, если юзер уже играет (started) --> error
        if ($this->isUserPlaying($userId)) 
            return Answer::error(2001);

        $userType = $this->getUserTypeInRoom($userId);

        // проверка, если комната уже создана юзером (owner) --> error
        if ($userType === 'owner') 
            return Answer::error(2002);

        // если юзер является участником другой комнаты (ready) --> leave & create
        if ($userType === 'participant') {
            $currentRoomMember = $this->db->getRoomMemberByUserId($userId);
            if ($currentRoomMember && isset($currentRoomMember->room_id) && $currentRoomMember->room_id == $roomId) 
                return Answer::error(2004);
            $this->leaveParticipantFromRoom($userId);
        }
        
        // Получаем character_id пользователя
        $character = checkCharacter($this->db, $userId);
        
        // добавляем перса в комнату
        $this->db->addRoomMember($roomId, $character->id, 'participant');
        
        // проверяем, заполнилась ли комната
        $roomMembers = $this->db->getAllRoomMembers($roomId);
        if (count($roomMembers) >= $room->room_size) $this->db->updateRoomStatus($roomId, 'closed');
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    // выход из комнаты
    public function leaveRoom($userId) {
        $userType = $this->getUserTypeInRoom($userId);
        
        // если юзер не в комнате, то ошибка
        if (!$userType) 
            return Answer::error(2006);
        
        // получаем информацию о комнате пользователя
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        if (!$roomMember) 
            return Answer::error(2006);
        
        // если юзер === 'owner', то комната распускается, а если юзер НЕ 'owner', то он удаляется из комнаты
        if ($userType === 'owner') {
            if ($roomMember && isset($roomMember->room_id)) {
                $this->db->deleteAllRoomMembers($roomMember->room_id);
                $this->db->deleteRoom($roomMember->room_id);
            }
        } else {
            $this->leaveParticipantFromRoom($userId);
            if (isset($roomMember->room_id)) $this->db->updateRoomStatus($roomMember->room_id, 'open');
        }
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    // кик участника из комнаты
    public function dropFromRoom($userId, $targetToken) {
        // получаем инфу о юзере
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        
        // проверяем, что владелец вообще в комнате и является owner
        if (!$roomMember || !isset($roomMember->type) || $roomMember->type !== 'owner') 
            return Answer::error(2008);
        
        // получаем цель по его токену
        $targetUser = $this->db->getUserByToken($targetToken);
        if (!$targetUser || !isset($targetUser->id)) 
            return Answer::error(705);
        
        $targetId = $targetUser->id;
        
        // проверяем, что владелец не пытается кикнуть себя
        if ($userId == $targetId) 
            return Answer::error(2007);
        
        $targetRoomMember = $this->db->getRoomMemberByUserId($targetId);
        
        // проверяем, что цель вообще находится в той же комнате
        if (!$targetRoomMember || !isset($targetRoomMember->room_id) || $targetRoomMember->room_id != $roomMember->room_id) 
            return Answer::error(2009);
        
        // кикаем участника
        $this->db->leaveParticipantFromRoom($targetId);
        
        // открываем комнату после кика участника
        $this->db->updateRoomStatus($roomMember->room_id, 'open');
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    // запуск игры
    public function startGame($userId) {
        // получаем инфу о юзере
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        
        // проверяем, что владелец вообще в комнате и является owner
        if (!$roomMember || !isset($roomMember->type) || $roomMember->type !== 'owner') 
            return Answer::error(2010);
        
        // есть ли такая комната и закрыта ли она
        $room = $this->db->getRoomById($roomMember->room_id);
        if (!$room || !isset($room->status) || $room->status != 'closed') 
            return Answer::error(2011); 
        
        $roomMembers = $this->db->getAllRoomMembers($roomMember->room_id);
        
        $readyPlayers = 0;
        foreach ($roomMembers as $member) {
            if ((is_object($member) && isset($member->status) && $member->status === 'ready') ||
                (is_array($member) && isset($member['status']) && $member['status'] === 'ready')) {
                $readyPlayers++;
            }
        }
        
        if ($readyPlayers != $room->room_size) 
            return Answer::error(2012); 
        
        $this->db->updateRoomStatus($roomMember->room_id, 'started');
        $this->db->updateAllRoomMembersStatus($roomMember->room_id, 'started');
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    // переименование комнаты
    public function renameRoom($userId, $newRoomName) {
        // получаем инфу о юзере
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        
        // проверяем, что владелец вообще в комнате и является owner
        if (!$roomMember || !isset($roomMember->type) || $roomMember->type !== 'owner') 
            return Answer::error(2010);
        
        // есть ли такая комната
        $room = $this->db->getRoomById($roomMember->room_id);
        if (!$room) return Answer::error(2003);
        
        $roomRenamed = $this->db->updateRoomName($roomMember->room_id, $newRoomName);
        if (!$roomRenamed) return Answer::error(2014);
        
        $this->db->updateRoomHash(md5(rand()));
        return true;
    }

    // получение списка комнат
    public function getRooms($roomHash) {
        $currentHash = $this->db->getRoomHash();
        
        if ($roomHash === $currentHash) return ['status' => 'unchanged'];
        
        $rooms = $this->db->getOpenAndClosedRooms();
        $roomsWithMembers = [];
        foreach ($rooms as $room) {
            $roomId = isset($room->id) ? $room->id : $room['id'];
            $members = $this->db->getAllRoomMembersWithUserInfo($roomId);
            $roomsWithMembers[] = [
                'id' => $roomId,
                'name' => isset($room->name) ? $room->name : $room['name'],
                'status' => isset($room->status) ? $room->status : $room['status'],
                'room_size' => isset($room->room_size) ? $room->room_size : $room['room_size'],
                'players_count' => isset($room->players_count) ? $room->players_count : $room['players_count'],
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
