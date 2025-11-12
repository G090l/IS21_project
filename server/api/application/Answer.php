<?php

class Answer {
    static $CODES = array(
        '101' => 'Param method not setted',
        '102' => 'Method not found',
        '242' => 'Params not set fully',
        '404' => 'Not found',
        '705' => 'User is not found',
        '706' => 'Character is not found',
        '1001' => 'Params login or password not set',
        '1002' => 'Wrong login or password',
        '1003' => 'Error to logout user',
        '1004' => 'Error to register user',
        '1005' => 'User is no exists',
        '1006' => 'User with this email is already registered',
        '1007' => 'The character has not been created',
        '1008' => 'Class not assigned',
        '1009' => 'Class not selected',
        //lobby
        '2001' => 'User is already playing',
        '2002' => 'User is already owner of this room',
        '2003' => 'Room not found',
        '2004' => 'User already in room',
        '2005' => 'The room is not available',
        '2006' => 'User is not in room',
        '2007' => 'Owner cannot kick yourself',
        '2008' => 'Only the owner can kick out participants of the room.',
        '2009' => 'User to kick not found in room',
        '2010' => 'You are not the owner of the room',
        '2011' => 'Room not found or not open',
        '2012' => 'Room is not full (need all players ready)',
        '2013' => 'Invalid room size (must be between 1 and 6)',
        '2014' => 'Error renaming room',
         //classes
        '3001' => 'No classes found',
        '3002' => 'Class not found',
        '3003' => 'User not found',
        '3004' => 'Insufficient funds',
        '3005' => 'Error during purchase',
        '3006' => 'Class not owned',
        '3007' => 'Class already purchased',
        //item
        '4001' => 'Item not found',
        '4002' => 'Not enough money to buy',
        '4003' => 'Item already owned',
        '4004' => 'Error purchasing item',
        '4005' => 'Maximum quantity reached for this item type',
        '4006' => 'Item not found in inventory',
        '4007' => 'Error selling item',
        //bots
        '5001' => 'Bot type not found',
        '5002' => 'Error spawning bot',
        '5003' => 'Invalid bot data format',
        '5004' => 'Bot not found in room',
        '5005' => 'There are no bots in the room',
        '5006' => 'Attacker-user not found', 
        '5007' => 'Attacker-user not in room', 
        '5008' => 'Error adding money reward',
        //arrows
        '6001' => 'Arrow creator not found',
        '6002' => 'Arrow creator not in room', 
        '6003' => 'Invalid arrow coordinates',
        '6004' => 'Arrow not found in room',
        '6005' => 'Creator direction not set',
        '6006' => 'No bow equipped',
        '6007' => 'No arrows equipped',
        '6008' => 'No arrows in room', 
        //math
        '8001' => 'Enter at least one value',
        '8002' => 'The discriminant cannot be less than zero',
        '8003' => 'No real roots found',
        //other
        '9000' => 'Unknown error'
    );

    static function response($data) {
        if ($data) {
            if (!is_bool($data) && array_key_exists('error', $data)) {
                $code = $data['error'];
                return [
                    'result' => 'error',
                    'error' => [
                        'code' => $code,
                        'text' => self::$CODES[$code]
                    ]
                ];
            }
            return [
                'result' => 'ok',
                'data' => $data
            ];
        }
        $code = 9000;
        return [
            'result' => 'error',
            'error' => [
                'code' => $code,
                'text' => self::$CODES[$code]
            ]
        ];
    }
}
