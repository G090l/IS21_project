<?php
class DB {
    private $pdo;

    function __construct() {
        $host = DB_HOST;
        $port = DB_PORT;
        $user = DB_USER;      
        $pass = DB_PASS;          
        $db = DB_NAME;
        $charset = DB_CHARSET;  
        $connect = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
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

    public function createCharacter($userId) {
        return $this->execute(
            "INSERT INTO characters (user_id, hp, defense, money) VALUES (?, 100, 0, 1000)",
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
        return $this->query("SELECT type, room_id as roomId FROM room_members WHERE character_id=?", [$character->id]);
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
        return $roomId;
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
        return $this->query("SELECT id, room_id as roomId, character_id as characterId, type, status, data FROM room_members WHERE character_id=?", [$character->id]);
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

    public function getOpenAndClosedRooms() {
        return $this->queryAll("
            SELECT r.id, r.name, r.status, r.room_size as roomSize, COUNT(rm.character_id) as playersCount 
            FROM rooms r 
            LEFT JOIN room_members rm ON r.id = rm.room_id 
            WHERE r.status IN ('open', 'closed') 
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

    public function getAllRoomMembersWithUserInfo($roomId) {
        return $this->queryAll("
            SELECT 
                rm.character_id as characterId,
                rm.type,
                rm.status,
                u.id as userId,
                u.login,
                u.nickname,
                c.money,
                u.token
            FROM room_members rm 
            JOIN characters c ON rm.character_id = c.id 
            JOIN users u ON c.user_id = u.id 
            WHERE rm.room_id = ?
        ", [$roomId]);
    }

    public function createInitialBotsForRoom($roomId) {
        $initialData = json_encode([]);
        return $this->execute(
            "INSERT INTO bots_rooms (room_id, data) VALUES (?, ?)",
            [$roomId, $initialData]
        );
    }

    public function createInitialArrowsForRoom($roomId) {
        $initialData = json_encode([]); 
        return $this->execute(
            "INSERT INTO arrows (room_id, data) VALUES (?, ?)",
            [$roomId, $initialData]
        );
    }

 
    public function deleteAllBotsForRoom($roomId) {
        return $this->execute("DELETE FROM bots_rooms WHERE room_id = ?", [$roomId]);
    }

    public function deleteAllArrowsForRoom($roomId) {
        return $this->execute("DELETE FROM arrows WHERE room_id = ?", [$roomId]);
    }

    // classes
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

    public function getUserSelectedClassId($userId) {
        $character = $this->getCharacterByUserId($userId);
        if (!$character) return null;
        
        $result = $this->query(
            "SELECT class_id FROM characters_classes WHERE character_id = ? AND selected = 1",
            [$character->id]
        );
        
        return $result ? $result->class_id : null;
    }

    public function getUserPurchasedClassIds($userId) {
        $character = $this->getCharacterByUserId($userId);
        if (!$character) return [];
        
        $results = $this->queryAll(
            "SELECT class_id FROM characters_classes WHERE character_id = ?",
            [$character->id]
        );
        
        $classIds = [];
        foreach ($results as $row) {
            $classIds[] = (int)$row['class_id'];
        }
        
        return $classIds;
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

    public function hasCharacterWeaponType($characterId, $weaponType) {
        return $this->query(
            "SELECT ci.* FROM character_items ci 
            JOIN items i ON ci.item_id = i.id 
            WHERE ci.character_id = ? AND i.weapon_type = ?",
            [$characterId, $weaponType]
        );
    }

    public function hasCharacterArrows($characterId) {
        $arrowItem = $this->query(
            "SELECT ci.* FROM character_items ci 
            JOIN items i ON ci.item_id = i.id 
            WHERE ci.character_id = ? AND i.item_type = 'arrow' AND ci.quantity > 0",
            [$characterId]
        );
        return $arrowItem && $arrowItem->quantity > 0;
    }


    public function hasCharacterPotions($characterId) {
        $potionItem = $this->query(
            "SELECT ci.* FROM character_items ci 
            JOIN items i ON ci.item_id = i.id 
            WHERE ci.character_id = ? AND i.item_type = 'potion' AND ci.quantity > 0",
            [$characterId]
        );
        return $potionItem && $potionItem->quantity > 0;
    }

    public function getCharacterConsumable($characterId, $itemType) {
        return $this->query(
            "SELECT ci.id, ci.item_id, ci.quantity 
            FROM character_items ci 
            JOIN items i ON ci.item_id = i.id 
            WHERE ci.character_id = ? AND i.item_type = ?",
            [$characterId, $itemType]
        );
    }

    public function getUserPurchasedItemsWithQuantity($characterId) {
        $results = $this->queryAll(
            "SELECT item_id as itemId, quantity FROM character_items WHERE character_id = ?",
            [$characterId]
        );
        
        $items = [];
        foreach ($results as $row) {
            $items[] = [
                'itemId' => (int)$row['itemId'],
                'quantity' => (int)$row['quantity']
            ];
        }
        
        return $items;
    }

    public function getAllItemsData() {
        return $this->queryAll("
            SELECT 
                id,
                name,
                item_type as itemType,
                weapon_type as weaponType,
                damage,
                attack_speed as attackSpeed,
                attack_distance as attackDistance,
                bonus_defense as bonusDefense,
                bonus_hp as bonusHp,
                cost
            FROM items
        ");
    }

    // bots
    public function getBotTypeById($botTypeId) {
        return $this->query("SELECT * FROM bots WHERE id = ?", [$botTypeId]);
    }

    public function getBotsByRoomId($roomId) {
        return $this->queryAll("
            SELECT id, room_id as roomId, data
            FROM bots_rooms 
            WHERE room_id = ?
        ", [$roomId]);
    }


    public function getAllBotsData() {
        return $this->queryAll("
            SELECT 
                id,
                name,
                hp,
                damage,
                attack_speed as attackSpeed,
                attack_distance as attackDistance,
                money
            FROM bots
        ");
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

    //arrows
    public function getArrowsByRoomId($roomId) {
        return $this->queryAll("
            SELECT id, room_id as roomId, data
            FROM arrows 
            WHERE room_id = ?
        ", [$roomId]);
    }

    //hashes
    public function getAllSceneHashes() {
        $result = $this->query("SELECT character_hash as characterHash, bot_hash as botHash, arrow_hash as arrowHash FROM hashes WHERE id = 1");
        return $result;
    }

    public function updateCharacterHash($hash) {
        $this->execute("UPDATE hashes SET character_hash = ? WHERE id = 1", [$hash]);
    }

    public function updateBotHash($hash) {
        $this->execute("UPDATE hashes SET bot_hash = ? WHERE id = 1", [$hash]);
    }

    public function updateArrowHash($hash) {
        $this->execute("UPDATE hashes SET arrow_hash = ? WHERE id = 1", [$hash]);
    }

    //game
    public function getAllRoomMembersWithData($roomId) {
        return $this->queryAll("
            SELECT 
                rm.id,
                rm.character_id as characterId,
                rm.type,
                rm.status,
                rm.action_status as actionStatus,
                rm.data,
                u.id as userId,
                u.login,
                u.nickname,
                c.money,
                u.token
            FROM room_members rm 
            JOIN characters c ON rm.character_id = c.id 
            JOIN users u ON c.user_id = u.id 
            WHERE rm.room_id = ?
        ", [$roomId]);
    }

    public function updateAllBotsInRoom($roomId, $botsData) {
        return $this->execute(
            "UPDATE bots_rooms SET data = ? WHERE room_id = ?",
            [$botsData, $roomId]
        );
    }

    public function updateAllArrowsInRoom($roomId, $arrowsData) {
        return $this->execute(
            "UPDATE arrows SET data = ? WHERE room_id = ?",
            [$arrowsData, $roomId]
        );
    }

    public function updateRoomMemberData($roomMemberId, $actionStatus, $data) {
        return $this->execute(
            "UPDATE room_members SET data = ?, action_status = ? WHERE id = ?",
            [$data, $actionStatus, $roomMemberId]
        );
    }

    // test
    public function deleteUser($userId) {
        return $this->execute("DELETE FROM users WHERE id=?", [$userId]);
    }

    public function deleteAllCharacterClasses($characterId) {
        return $this->execute("DELETE FROM characters_classes WHERE character_id = ?", [$characterId]);
    }
}
