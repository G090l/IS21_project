<?php
require_once('application/config.php');

class ItemManager {
    function __construct($db) { 
        $this->db = $db;
    }
    
    // покупка шмота
    public function buyItem($userId, $itemId) {

        // проверка, существует ли юзер
        $user = checkUser($this->db, $userId);
        
        // проверка, существует ли шмот
        $item = checkItemExists($this->db, $itemId);
        
        // проверка, есть ли у юзера персонаж
        $character = checkCharacter($this->db, $userId);
        
        // проверка, есть ли у персонажа деньги
        if ($character->money < $item->cost) return Answer::error(4002);
        
        // проверка, есть ли такие шмотки у юзера
        $existingItem = $this->db->getUserItem($character->id, $itemId);
        
        if ($existingItem) {
            // для зелей - ограничение 3 штуки
            if ($item->item_type === 'potion') {
                if ($existingItem->quantity >= 3) return Answer::error(4005);
            }
            // для стрел - ограничение 50 штук
            else if ($item->item_type === 'arrow') {
                if ($existingItem->quantity >= 50) return Answer::error(4005);
            }
            // для остальных шмоток - ограничение 1 штука
            else return Answer::error(4003);
        }
        
        // начинаем транзакцию
        $this->db->beginTransaction();
        
        try {
            // списываем деньги
            $moneyUpdated = $this->db->updateCharacterMoneySubtract($character->id, $item->cost);
            if (!$moneyUpdated) {
                $this->db->rollBack();
                return Answer::error(4004);
            }
            
            // если расходники уже есть в инвентаре, увеличиваем количество
            if ($existingItem && in_array($item->item_type, ['potion', 'arrow'])) {
                $newQuantity = $existingItem->quantity + 1;
                $itemUpdated = $this->db->updateUserItemQuantity($character->id, $itemId, $newQuantity);
                if (!$itemUpdated) {
                    $this->db->rollBack();
                    return Answer::error(4004);
                }
            } else {
                // добавляем шмот в инвентарь
                $itemAdded = $this->db->addUserItem($character->id, $itemId);
                if (!$itemAdded) {
                    $this->db->rollBack();
                    return Answer::error(4004);
                }
            }
            
            $this->db->commit();
            return true;
            
        } catch (Exception $e) {
            $this->db->rollBack();
            return Answer::error(4004);
        }
    }

    // продажа шмота
    public function sellItem($userId, $itemId) {
        // проверка, существует ли юзер
        $user = checkUser($this->db, $userId);
        
        // проверка, существует ли шмот
        $item = checkItemExists($this->db, $itemId);
        
        // проверка, есть ли у юзера персонаж
        $character = checkCharacter($this->db, $userId);
        
        // проверка, есть ли предмет в инвентаре
        $userItem = $this->db->getUserItem($character->id, $itemId);
        if (!$userItem) return Answer::error(4006);
        
        $sellPrice = round($item->cost / 2, 1);
        
        $this->db->beginTransaction();
        
        try {
            // для расходников уменьшаем количество, для остального шмота - удаляем
            if (in_array($item->item_type, ['potion', 'arrow']) && $userItem->quantity > 1) {
                $itemUpdated = $this->db->updateUserItemQuantity($character->id, $itemId, $userItem->quantity - 1);
                if (!$itemUpdated) {
                    $this->db->rollBack();
                    return Answer::error(4007);
                }
            } else {
                $itemDeleted = $this->db->deleteUserItem($character->id, $itemId);
                if (!$itemDeleted) {
                    $this->db->rollBack();
                    return Answer::error(4007);
                }
            }
            
            // добавляем деньги персу
            $moneyUpdated = $this->db->updateCharacterMoneyAdd($character->id, $sellPrice);
            if (!$moneyUpdated) {
                $this->db->rollBack();
                return Answer::error(4007);
            }
            
            $this->db->commit();
            return true;
            
        } catch (Exception $e) {
            $this->db->rollBack();
            return Answer::error(4007);
        }
    }

    // проверка на наличие лука и стрел
    public function checkBowAndArrows($userId) {
        // проверка, существует ли юзер
        $user = checkUser($this->db, $userId);

        // получаем персонажа
        $character = checkCharacter($this->db, $userId);

        // проверка лука
        $hasBow = checkHasBow($this->db, $character->id);
        if (!$hasBow) return Answer::error(4008);

        // проверка стрел
        $hasArrows = checkHasArrows($this->db, $character->id);
        if (!$hasArrows) return Answer::error(4009);

        return true;
    }

    // вычитание стрелы из инвентаря
    public function consumeArrow($userId) {
        // проверка, существует ли юзер
        $user = checkUser($this->db, $userId);

        // получаем персонажа
        $character = checkCharacter($this->db, $userId);

        // проверка стрел
        $hasArrows = checkHasArrows($this->db, $character->id);
        if (!$hasArrows) return Answer::error(4009);

        // вычитаем стрелу
        $this->db->consumeCharacterArrow($character->id);
        return true;
    }
}
