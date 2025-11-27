<?php
require_once('Answer.php');

//Вынесены все повторяющиеся проверки(возможно не все...)

// User

// Возвращаем объект пользователя или null
function checkUser($db, $userId) {
    $user = $db->getUserById($userId);
    return $user ? $user : null;
}

// false если играет, true если не играет
function checkUserNotPlaying($db, $userId): bool 
{
    return !$db->isUserPlaying($userId);
}

// Возвращаем объект пользователя по логину или null
function checkUserByLogin($db, $login) 
{
    return $db->getUserByLogin($login) ?: null;
}

// Возвращаем объект пользователя по токену или null
function checkUserByToken($db, $token) 
{
    return $db->getUserByToken($token) ?: null;
}


//Classes
// Возвращаем объект характера или null
function checkCharacter($db, $userId) 
{
    return $db->getCharacterByUserId($userId) ?: null;
}

//Item
// Возвращаем объект предмета или null
function checkItemExists($db, $itemId) 
{
    return $db->getItemById($itemId) ?: null;
}


// Если у персонажа есть лук, то возвращаем тру, иначе false
function checkHasBow($db, $characterId): bool 
{
    return (bool) $db->hasCharacterWeaponType($characterId, 'bow');
}

// Если у персонажа есть стрелы,то возвращаем true, иначе false
function checkHasArrows($db, $characterId): bool 
{
    return (bool) $db->hasCharacterArrows($characterId);
}


//Lobby
// Возвращаем объект комнаты или null
function checkRoomExists($db, $roomId) 
{
    return $db->getRoomById($roomId) ?: null;
}

// true если status === 'open'
function checkRoomOpen($room): bool 
{
    return isset($room->status) && $room->status === 'open';
}

// true если status === 'closed'
function checkRoomClosed($room): bool 
{
    return isset($room->status) && $room->status === 'closed';
}

// true если status === 'started'
function checkRoomStarted($room): bool 
{
    return isset($room->status) && $room->status === 'started';
}

// Возвращаем объект roomMember или null
function checkRoomMember($db, $userId) 
{
    return $db->getRoomMemberByUserId($userId) ?: null;
}

// true если type === 'owner'
function checkOwner($roomMember): bool 
{
    return isset($roomMember->type) && $roomMember->type === 'owner';
}

// true если участник принадлежит roomId
function checkRoomMemberInRoom($roomMember, $roomId): bool 
{
    return isset($roomMember->room_id) && $roomMember->room_id == $roomId;
}

//Общие 
// True только когда все ключи переданы
function requireParams(array $params, array $keys): bool {
    foreach ($keys as $k) {
        if (!isset($params[$k]) || $params[$k] === '') 
            return false;
    }
    return true;
}

// Обёртка для транзакций 
function wrapTransaction($db, $callback) {
    try {
        $db->beginTransaction();
        $result = $callback();

        if ($result === false || (is_array($result) && isset($result['error']))) {
            $db->rollBack();
            return ['error' => 3009];
        }

        $db->commit();
        return $result;
    }   catch (Exception $e) {
            $db->rollBack();
            return ['error' => 3009];
    }
}


//Заходит в казарму генерал и видит, что дембель на кровати лежит.Генерал спрашивает:- Ты кто?- Я дембель! А ты кто?- А я генерал!- Тоже ни херово!