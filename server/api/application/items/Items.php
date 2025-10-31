<?php

class Items {
    function __construct($db) { 
        $this->db = $db;
    }
    
    //покупка шмота
    public function buyItem($userId, $itemId) {

        //проверка, существует ли юзер
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }
        
        //проверка, существует ли шмот
        $item = $this->db->getItemById($itemId);
        if (!$item) {
            return ['error' => 4001];
        }
        
        //проверка, есть ли у юзера персонаж
        $character = $this->db->getCharacterByUserId($userId);
        if (!$character) {
            return ['error' => 706];
        }
        
        //проверка, есть ли у персонажа деньги
        if ($character->money < $item->cost) {
            return ['error' => 4002];
        }
        
        //проверка, есть ли такие шмотки у юзера
        $existingItem = $this->db->getUserItem($character->id, $itemId);
        
        if ($existingItem) {
            //для зелей - ограничение 3 штуки
            if ($item->item_type === 'potion') {
                if ($existingItem->quantity >= 3) {
                    return ['error' => 4005];
                }
            }
            //для стрел - ограничение 50 штуки
            else if ($item->item_type === 'arrow') {
                if ($existingItem->quantity >= 50) {
                    return ['error' => 4005];
                }
            }
            //для остальных шмоток - ограничение 1 штука
            else {
                return ['error' => 4003];
            }
        } else {
        }
        
        //начинаем транзакцию
        $this->db->beginTransaction();
        
        try {
            //списываем деньгу 
            $moneyUpdated = $this->db->updateCharacterMoneySubtract($character->id, $item->cost);
            if (!$moneyUpdated) {
                $this->db->rollBack();
                return ['error' => 4004];
            }
            
            //если расходники уже есть в инвентаре, увеличиваем количество
            if ($existingItem && in_array($item->item_type, ['potion', 'arrow'])) {
                $newQuantity = $existingItem->quantity + 1;
                $itemUpdated = $this->db->updateUserItemQuantity($character->id, $itemId, $newQuantity);
                if (!$itemUpdated) {
                    $this->db->rollBack();
                    return ['error' => 4004];
                }
            } else {
                //добавляем шмот в инвентарь
                $itemAdded = $this->db->addUserItem($character->id, $itemId);
                if (!$itemAdded) {
                    $this->db->rollBack();
                    return ['error' => 4004];
                }
            }
            
            $this->db->commit();
            return true;
            
        } catch (Exception $e) {
            $this->db->rollBack();
            return ['error' => 4004];
        }
    }

    //продажа шмота
    public function sellItem($userId, $itemId) {
        //проверка, существует ли юзер
        $user = $this->db->getUserById($userId);
        if (!$user) {
            return ['error' => 705];
        }
        
        //проверка, существует ли шмот
        $item = $this->db->getItemById($itemId);
        if (!$item) {
            return ['error' => 4001];
        }
        
        //проверка, есть ли у юзера персонаж
        $character = $this->db->getCharacterByUserId($userId);
        if (!$character) {
            return ['error' => 706];
        }
        
        //проверка, есть ли предмет в инвентаре
        $userItem = $this->db->getUserItem($character->id, $itemId);
        if (!$userItem) {
            return ['error' => 4006];
        }
        
        
        $sellPrice = round($item->cost / 2, 1);
        
        $this->db->beginTransaction();
        
        try {
            //для расходников умнешаем количество, для остального шмота - удаляем
            if (in_array($item->item_type, ['potion', 'arrow']) && $userItem->quantity > 1) {
                //уменьшаем количество расходника на 1
                $itemUpdated = $this->db->updateUserItemQuantity($character->id, $itemId, $userItem->quantity - 1);
                if (!$itemUpdated) {
                    $this->db->rollBack();
                    return ['error' => 4007];
                }
            } else {
                //удаление обычного шмота
                $itemDeleted = $this->db->deleteUserItem($character->id, $itemId);
                if (!$itemDeleted) {
                    $this->db->rollBack();
                    return ['error' => 4007];
                }
            }
            
            //добавляем деньги персу
            $moneyUpdated = $this->db->updateCharacterMoneyAdd($character->id, $sellPrice);
            if (!$moneyUpdated) {
                $this->db->rollBack();
                return ['error' => 4007];
            }
            
            $this->db->commit();
            return true;
            
        } catch (Exception $e) {
            $this->db->rollBack();
            return ['error' => 4007];
        }
    }

}
