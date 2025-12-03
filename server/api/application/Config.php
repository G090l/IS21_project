<?php
require_once('Answer.php');

//Вынесены все повторяющиеся проверки(возможно не все...)

// User

// Возвращаем объект пользователя или ошибку
function checkUser($db, $userId) {
    if (!is_numeric($userId) || $userId <= 0) {
        return Answer::error(3008);
    }

    $user = $db->getUserById($userId);
    if (!$user) {
        return Answer::error(705);
    }

    return $user;
}

// false если играет, true если не играет
function checkUserNotPlaying($db, $userId): bool 
{
    return !$db->isUserPlaying($userId);
}

// Провека объекта пользователя по логину
function checkUserByLogin($db, $login) 
{
    if (!$login) {
        return Answer::error(1001);
    }

    $user = $db->getUserByLogin($login);
    if (!$user) {
        return Answer::error(1005);
    }

    return $user;
}

// Проверка объекта пользователя по токену
function checkUserByToken($db, $token) 
{
    if (!$token) {
        return Answer::error(1001);
    }

    $user = $db->getUserByToken($token);
    if (!$user) {
        return Answer::error(705);
    }

    return $user;
}


//Classes
// Проверяем объект характера
function checkCharacter($db, $userId) 
{
    $character = $db->getCharacterByUserId($userId);
    if (!$character) {
        return Answer::error(706);
    }
    return $character;
}

//Item
// Проверяем объект предмета
function checkItemExists($db, $itemId) 
{
    if (!is_numeric($itemId) || $itemId <= 0) {
        return Answer::error(4001);
    }

    $item = $db->getItemById($itemId);
    if (!$item) {
        return Answer::error(4001);
    }

    return $item;
}


// Если у персонажа есть лук, то возвращаем true
function checkHasBow($db, $characterId): bool 
{
    return (bool) $db->hasCharacterWeaponType($characterId, 'bow');
}

// Если у персонажа есть стрелы,то возвращаем true
function checkHasArrows($db, $characterId): bool 
{
    return (bool) $db->hasCharacterArrows($characterId);
}


//Lobby
// Проверяем объект комнаты
function checkRoomExists($db, $roomId) 
{
    if (!is_numeric($roomId) || $roomId <= 0) {
        return Answer::error(2005);
    }

    $room = $db->getRoomById($roomId);
    if (!$room) {
        return Answer::error(2003);
    }

    return $room;
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

// правда если участник принадлежит roomId
function checkRoomMemberInRoom($roomMember, $roomId): bool 
{
    return isset($roomMember->room_id) && $roomMember->room_id == $roomId;
}

//Общие 
// true только когда все ключи переданы
function checkParams(array $params, array $keys) {
    foreach ($keys as $k) {
        if (!isset($params[$k]) || $params[$k] === '') {
            return Answer::error(242);
        }
    }
    return true;
}


//Заходит в казарму генерал и видит, что дембель на кровати лежит.Генерал спрашивает:- Ты кто?- Я дембель! А ты кто?- А я генерал!- Тоже ни херово!
