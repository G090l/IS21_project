<?php
require_once('application/Config.php');

class Game {
    private $db;

    function __construct($db) { 
        $this->db = $db;
    }

    // обновление данных персонажа
    public function updateCharacter($userId, $characterData) {
        // проверка, существует ли пользователь
        $user = checkUser($this->db, $userId);
        // проверка, есть ли юзер в комнате
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        if (!$roomMember) return Answer::error(2006);

        // сохраняем данные и обновляем хеш
        $this->db->updateRoomMemberData($roomMember->id, $characterData);
        $this->db->updateCharacterHash(md5(rand()));
        
        return true;
    }

    // получение сцены
    public function getScene($roomId, $characterHash, $botHash, $arrowHash) {
        // проверка, есть ли комната
        $room = checkRoomExists($this->db, $roomId);
        if (!$room) return Answer::error(2011);

        $currentCharHash = $this->db->getCharacterHash();
        $currentBotHash = $this->db->getBotHash();
        $currentArrowHash = $this->db->getArrowHash();

        // если все хеши совпадают - данные не изменились
        if ($characterHash === $currentCharHash && 
            $botHash === $currentBotHash && 
            $arrowHash === $currentArrowHash) {
            return [
                'status' => 'unchanged',
                'game_status' => $room->status
            ];
        }

        // получение всех данных сцены
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

    // получение всех данных ботов
    public function getBotsData() {
        return $this->db->getAllBotsData();
    }

    // обновление ботов
    public function updateBots($userId, $botsData) {
        // проверка, есть ли юзер
        $user = checkUser($this->db, $userId);
        // проверка, является ли юзер овнером
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        $ownerCheck = $roomMember ? checkOwner($roomMember) : false;
        if (!$ownerCheck) return Answer::error(2010);

        // проверка, что комната уже started
        $room = checkRoomExists($this->db, $roomMember->room_id);
        if (!$room) return Answer::error(2011);

        $statusCheck = checkRoomStarted($room);
        if (!$statusCheck) return Answer::error(2012);

        // сохраняем данные и обновляем хеш
        $this->db->updateAllBotsInRoom($roomMember->room_id, $botsData);
        $this->db->updateBotHash(md5(rand()));
        
        return true;
    }

    // обновление стрел
    public function updateArrows($userId, $arrowsData) {
        // проверка, есть ли юзер
        $user = checkUser($this->db, $userId);
        // проверка, является ли юзер овнером
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        $ownerCheck = $roomMember ? checkOwner($roomMember) : false;
        if (!$ownerCheck) return Answer::error(2010);

        // проверка, что комната уже started
        $room = checkRoomExists($this->db, $roomMember->room_id);
        if (!$room) return Answer::error(2011);

        $statusCheck = checkRoomStarted($room);
        if (!$statusCheck) return Answer::error(2012);

        // сохраняем данные и обновляем хеш
        $this->db->updateAllArrowsInRoom($roomMember->room_id, $arrowsData);
        $this->db->updateArrowHash(md5(rand()));
        
        return true;
    }

    // получение денег за убийство бота
    public function addMoneyForKill($userId, $killerToken, $botTypeId) {
        // проверка, существует ли юзер
        $user = checkUser($this->db, $userId);
        // проверка, является ли юзер овнером
        $roomMember = $this->db->getRoomMemberByUserId($userId);
        $ownerCheck = $roomMember ? checkOwner($roomMember) : false;
        if (!$ownerCheck) return Answer::error(2010);

        // проверка, что комната уже started
        $room = checkRoomExists($this->db, $roomMember->room_id);
        if (!$room) return Answer::error(2011);

        $statusCheck = checkRoomStarted($room);
        if (!$statusCheck) return Answer::error(2012);

        // проверка существования убийцы
        $killerUser = $this->db->getUserByToken($killerToken);
        if (!$killerUser) return Answer::error(705);

        // проверка, что убийца в комнате
        $killerRoomMember = $this->db->getRoomMemberByUserId($killerUser->id);
        if (!$killerRoomMember || $killerRoomMember->room_id != $roomMember->room_id) {
            return Answer::error(2006);
        }

        // получаем данные типа бота для награды
        $botType = $this->db->getBotTypeById($botTypeId);
        if (!$botType) return Answer::error(5001);

        // получаем персонажа убийцы
        $killerCharacter = checkCharacter($this->db, $killerUser->id);
        if (!$killerCharacter) return Answer::error(706);

        // начисляем деньги
        $reward = $botType->money;
        if ($reward > 0) {
            $this->db->updateCharacterMoneyAdd($killerCharacter->id, $reward);
        }

        return true;
    }
}
