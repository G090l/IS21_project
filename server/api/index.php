<?php

error_reporting(1);


header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once('application/config.php');
require_once('application/Answer.php');
require_once('application/Application.php');

function result($params) {
    $method = $params['method'];
    if ($method) {
        $app = new Application();
        switch ($method) {
            //UserManager
            case 'login': return $app->login($params);
            case 'logout': return $app->logout($params);
            case 'registration': return $app->registration($params);
            case 'deleteUser': return $app->deleteUser($params); // для тестеров
            case 'getUserInfo': return $app->getUserInfo($params);
            //MathManager
            case 'math': return $app->math($params);
            //ChatManager
            case 'sendMessage': return $app->sendMessage($params);
            case 'getMessages': return $app->getMessages($params);
            //LobbyManager
            case 'createRoom': return $app->createRoom($params);
            case 'joinToRoom': return $app->joinToRoom($params);
            case 'leaveRoom': return $app->leaveRoom($params);
            case 'dropFromRoom': return $app->dropFromRoom($params);
            case 'startGame': return $app->startGame($params);
            case 'renameRoom': return $app->renameRoom($params);
            case 'getRooms': return $app->getRooms($params);
            //ClassManager
            case 'getClasses': return $app->getClasses($params);
            case 'buyClass': return $app->buyClass($params);
            case 'selectClass': return $app->selectClass($params);
            //ItemManager
            case 'buyItem': return $app->buyItem($params);
            case 'sellItem': return $app->sellItem($params);
            case 'useArrow': return $app->useArrow($params);
            case 'usePotion': return $app->usePotion($params);
            //GameManager
            case 'getScene': return $app->getScene($params);
            case 'updateCharacter': return $app->updateCharacter($params);
            case 'updateBots': return $app->updateBots($params);
            case 'updateArrows': return $app->updateArrows($params);
            case 'getBotsData': return $app->getBotsData($params);
            case 'addMoneyForKill': return $app->addMoneyForKill($params);

            default: return ['error' => 102];
        }
    }
    return ['error' => 101];
}

echo json_encode(Answer::response(result($_GET)), JSON_UNESCAPED_UNICODE);
