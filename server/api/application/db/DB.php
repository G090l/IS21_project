<?php
class DB {
    private $pdo;

    function __construct() {
        //$host = '127.0.0.1';
        //$host = '127.127.126.15';
        $host = 'MySQL-8.0';
        $port = '3306';
        $user = 'root';      
        $pass = '';          
        $db = 'knightwars';  
        $connect = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
        $this->pdo = new PDO($connect, $user, $pass);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function __destruct() {
        $this->pdo = null;
    }

    private function execute($sql, $params = []) {
        $sth = $this->pdo->prepare($sql);
        return $sth->execute($params);
    }

    private function query($sql, $params = []) {
        $sth = $this->pdo->prepare($sql);
        $sth->execute($params);
        return $sth->fetch(PDO::FETCH_OBJ);
    }

    private function queryAll($sql, $params = []) {
        $sth = $this->pdo->prepare($sql);
        $sth->execute($params);
        return $sth->fetchAll(PDO::FETCH_ASSOC);
    }

    // user
    public function getUserByLogin($login) {
        return $this->query("SELECT * FROM users WHERE login=?", [$login]);
    }

    public function getUserByToken($token) {
        return $this->query("SELECT * FROM users WHERE token=?", [$token]);
    }

    public function getUserById($id) {
        return $this->query("SELECT * FROM users WHERE id = ?", [$id]);
    }

    public function updateToken($userId, $token) {
        $this->execute("UPDATE users SET token=? WHERE id=?", [$token, $userId]);
    }

    public function registration($login, $password, $nickname) {
        $this->execute("INSERT INTO users (login, password, nickname) VALUES (?, ?, ?)", [$login, $password, $nickname]);
    }

    // character
    public function getCharacterByUserId($userId) {
        return $this->query("SELECT * FROM characters WHERE user_id = ?", [$userId]);
    }

    public function getCharacterIdByUserId($userId) {
        $character = $this->query("SELECT id FROM characters WHERE user_id = ?", [$userId]);
        return $character ? $character->id : null;
    }

    public function createCharacter($userId) {
        return $this->execute(
            "INSERT INTO characters (user_id, hp, defense, money, died) VALUES (?, 100, 0, 1000, 0)",
            [$userId]
        );
    }

    public function deleteCharacter($userId) {
        return $this->execute("DELETE FROM characters WHERE user_id = ?", [$userId]);
    }

    public function updateCharacterMoneyAdd($characterId, $amount) {
        return $this->execute("UPDATE characters SET money = money + ? WHERE id = ?", [$amount, $characterId]);
    }

    public function updateCharacterMoneySubtract($characterId, $amount) {
        return $this->execute("UPDATE characters SET money = money - ? WHERE id = ?", [$amount, $characterId]);
    }

    // chat
    public function getChatHash() {
        return $this->query("SELECT * FROM hashes WHERE id=1");
    }

    public function updateChatHash($hash) {
        $this->execute("UPDATE hashes SET chat_hash=? WHERE id=1", [$hash]);
    }

    public function addMessage($userId, $message) {
        $this->execute('INSERT INTO messages (user_id, message, created) VALUES (?,?, now())', [$userId, $message]);
    }

    public function getMessages() {
        return $this->queryAll("
            SELECT u.nickname AS author, m.message AS message,
                   DATE_FORMAT(m.created, '%Y-%m-%d %H:%i:%s') AS created 
            FROM messages as m 
            LEFT JOIN users as u on u.id = m.user_id 
            ORDER BY m.created DESC
        ");
    }

    public function deleteUserMessages($userId) {
        return $this->execute("DELETE FROM messages WHERE user_id = ?", [$userId]);
    }

    // lobby
    public function isUserPlaying($userId) {
        $character = $this->getCharacterByUserId($userId);
        if (!$character) return false;
        return $this->query("SELECT id FROM room_members WHERE character_id = ? AND status = 'started'", [$character->id]);
    }

    public function getUserTypeInRoom($userId) {
        $character = $this->getCharacterByUserId($userId);
        if (!$character) return false;
        return $this->query("SELECT type FROM room_members WHERE character_id=?", [$character->id]);
    }

    public function leaveParticipantFromRoom($userId) {
        $character = $this->getCharacterByUserId($userId);
        if (!$character) return false;
        $this->execute("DELETE FROM room_members WHERE character_id=?", [$character->id]);
    }

    public function createRoom($userId, $roomName, $roomSize) {
        $character = $this->getCharacterByUserId($userId);
        if (!$character) return false;
        $this->execute("INSERT INTO rooms (name, room_size) VALUES (?, ?)", [$roomName, $roomSize]);
        $roomId = $this->pdo->lastInsertId();
        $this->addRoomMember($roomId, $character->id, 'owner');
    }

    public function addRoomMember($roomId, $characterId, $type, $status = 'ready') {
        return $this->execute(
            "INSERT INTO room_members (room_id, character_id, type, status) VALUES (?, ?, ?, ?)",
            [$roomId, $characterId, $type, $status]
        );
    }

    public function getRoomById($roomId) {
        return $this->query("SELECT id, status, name, room_size FROM rooms WHERE id=?", [$roomId]);
    }

    public function getRoomMember($roomId, $characterId) {
        return $this->query("SELECT * FROM room_members WHERE room_id=? AND character_id=?", [$roomId, $characterId]);
    }

    public function updateRoomHash($hash) {
        $this->execute("UPDATE hashes SET room_hash = ? WHERE id = 1", [$hash]);
    }

    public function getRoomHash() {
        $result = $this->query("SELECT room_hash FROM hashes WHERE id = 1");
        return $result ? $result->room_hash : null;
    }

    public function getRoomMemberByUserId($userId) {
        $character = $this->getCharacterByUserId($userId);
        if (!$character) return null;
        return $this->query("SELECT * FROM room_members WHERE character_id=?", [$character->id]);
    }

    public function getAllRoomMembers($roomId) {
        return $this->queryAll("SELECT * FROM room_members WHERE room_id=?", [$roomId]);
    }

    public function deleteAllRoomMembers($roomId) {
        $this->execute("DELETE FROM room_members WHERE room_id=?", [$roomId]);
    }

    public function deleteRoom($roomId) {
        $this->execute("DELETE FROM rooms WHERE id=?", [$roomId]);
    }

    public function getOpenRooms() {
        return $this->queryAll("
            SELECT r.id, r.name, r.status, r.room_size, COUNT(rm.character_id) as players_count 
            FROM rooms r 
            LEFT JOIN room_members rm ON r.id = rm.room_id 
            WHERE r.status = 'open' 
            GROUP BY r.id, r.name, r.status, r.room_size
        ");
    }

    public function updateRoomStatus($roomId, $status) {
        $this->execute("UPDATE rooms SET status=? WHERE id=?", [$status, $roomId]);
    }

    public function updateAllRoomMembersStatus($roomId, $status) {
        $this->execute("UPDATE room_members SET status=? WHERE room_id=?", [$status, $roomId]);
    }

    public function updateRoomName($roomId, $newRoomName) {
        return $this->execute("UPDATE rooms SET name = ? WHERE id = ?", [$newRoomName, $roomId]);
    }

    // classes
    public function getPersonClassByType($type) {
        return $this->query("SELECT * FROM classes WHERE type = ?", [$type]);
    }

    public function getPersonClassById($id) {
        return $this->query("SELECT * FROM classes WHERE id = ?", [$id]);
    }

    public function getAllPersonClasses() {
        return $this->queryAll("SELECT * FROM classes");
    }

    public function getUserPersonClass($userId, $classId) {
        $character = $this->getCharacterByUserId($userId);
        if (!$character) return null;
        return $this->query(
            "SELECT * FROM characters_classes WHERE character_id = ? AND class_id = ?",
            [$character->id, $classId]
        );
    }

    public function getUserOwnedClasses($userId) {
        $character = $this->getCharacterByUserId($userId);
        if (!$character) return [];
        return $this->queryAll("
            SELECT c.*, cc.selected FROM classes c
            JOIN characters_classes cc ON cc.class_id = c.id
            WHERE cc.character_id = ?
        ", [$character->id]);
    }

    public function addUserPersonClass($userId, $classId) {
        $character = $this->getCharacterByUserId($userId);
        if (!$character) return false;
        return $this->execute(
            "INSERT INTO characters_classes (character_id, class_id, selected) VALUES (?, ?, 0)",
            [$character->id, $classId]
        );
    }

    public function clearSelectedUserClasses($userId) {
        $character = $this->getCharacterByUserId($userId);
        if (!$character) return false;
        return $this->execute(
            "UPDATE characters_classes SET selected = 0 WHERE character_id = ?",
            [$character->id]
        );
    }

    public function setUserSelectedPersonClass($userId, $classId) {
        $character = $this->getCharacterByUserId($userId);
        if (!$character) return false;
        return $this->execute(
            "UPDATE characters_classes SET selected = 1 WHERE character_id = ? AND class_id = ?",
            [$character->id, $classId]
        );
    }

    // item
    public function getItemById($itemId) {
        return $this->query("SELECT * FROM items WHERE id = ?", [$itemId]);
    }

    public function getUserItem($characterId, $itemId) {
        return $this->query(
            "SELECT * FROM character_items WHERE character_id = ? AND item_id = ?",
            [$characterId, $itemId]
        );
    }

    public function addUserItem($characterId, $itemId) {
        return $this->execute(
            "INSERT INTO character_items (character_id, item_id, quantity) VALUES (?, ?, 1)",
            [$characterId, $itemId]
        );
    }

    public function updateUserItemQuantity($characterId, $itemId, $quantity) {
        return $this->execute(
            "UPDATE character_items SET quantity = ? WHERE character_id = ? AND item_id = ?",
            [$quantity, $characterId, $itemId]
        );
    }

    public function deleteUserItem($characterId, $itemId) {
        return $this->execute(
            "DELETE FROM character_items WHERE character_id = ? AND item_id = ?",
            [$characterId, $itemId]
        );
    }

    public function deleteAllCharacterItems($characterId) {
        return $this->execute("DELETE FROM character_items WHERE character_id = ?", [$characterId]);
    }

    // bots
    public function getBotByName($botName) {
        return $this->query("SELECT * FROM bots WHERE name = ?", [$botName]);
    }

    public function getBotById($botId) {
        return $this->query("SELECT * FROM bots_rooms WHERE id = ?", [$botId]);
    }

    public function getBotTypeById($botTypeId) {
        return $this->query("SELECT * FROM bots WHERE id = ?", [$botTypeId]);
    }

    public function addBotToRoom($roomId, $botType, $botData) {
        $jsonData = json_encode($botData);
        return $this->execute(
            "INSERT INTO bots_rooms (room_id, type, data) VALUES (?, ?, ?)",
            [$roomId, $botType, $jsonData]
        );
    }

    public function getBotsByRoomId($roomId) {
        return $this->queryAll("
            SELECT br.*, b.name, b.hp, b.damage, b.attack_speed, b.attack_distance, b.money 
            FROM bots_rooms br 
            JOIN bots b ON br.type = b.id 
            WHERE br.room_id = ?
        ", [$roomId]);
    }

    public function updateBotData($botId, $botData) {
        $jsonData = json_encode($botData);
        return $this->execute(
            "UPDATE bots_rooms SET data = ? WHERE id = ?",
            [$jsonData, $botId]
        );
    }

    public function removeBotFromRoom($botId) {
        return $this->execute("DELETE FROM bots_rooms WHERE id = ?", [$botId]);
    }

    // transactions
    public function beginTransaction() {
        return $this->pdo->beginTransaction();
    }

    public function commit() {
        return $this->pdo->commit();
    }

    public function rollBack() {
        return $this->pdo->rollBack();
    }

    // test
    public function deleteUser($userId) {
        return $this->execute("DELETE FROM users WHERE id=?", [$userId]);
    }

    public function deleteAllCharacterClasses($characterId) {
        return $this->execute("DELETE FROM characters_classes WHERE character_id = ?", [$characterId]);
    }
}
