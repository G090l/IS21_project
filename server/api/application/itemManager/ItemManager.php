<?php

class ItemManager extends BaseManager {

    //метод для использования расходников
    private function useConsumables($characterId, $itemType) {
        //получаем запись о расходнике
        $consumable = $this->db->getCharacterConsumable($characterId, $itemType);
        
        //обрабатываем в зависимости от количества
        if ($consumable->quantity > 1) {
            //уменьшаем количество на 1
            $newQuantity = $consumable->quantity - 1;
            $this->db->updateUserItemQuantity($characterId, $consumable->item_id, $newQuantity);
        } else {
            //последний предмет - удаляем
            $this->db->deleteUserItem($characterId, $consumable->item_id);
        }
        
        return true;
    }
    
    //покупка шмота
    public function buyItem($userId, $itemId) {
        //проверка пользователя
        $user = $this->checkUserExists($userId);
         if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;

        //проверка, существует ли шмот
        $item = $this->db->getItemById($itemId);
        if (!$item) {
            return ['error' => 4001];
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
                if ($existingItem->quantity >= MAX_POTIONS_PER_USER) {
                    return ['error' => 4005];
                }
            }
            //для стрел - ограничение 50 штуки
            else if ($item->item_type === 'arrow') {
                if ($existingItem->quantity >= MAX_ARROWS_PER_USER) {
                    return ['error' => 4005];
                }
            }
            //для остальных шмоток - ограничение 1 штука
            else {
                return ['error' => 4003];
            }
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
        //проверка пользователя
        $user = $this->checkUserExists($userId);
         if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;
        
        //проверка, существует ли шмот
        $item = $this->db->getItemById($itemId);
        if (!$item) {
            return ['error' => 4001];
        }

        //проверка, есть ли предмет в инвентаре
        $userItem = $this->db->getUserItem($character->id, $itemId);
        if (!$userItem) {
            return ['error' => 4006];
        }
        
        $sellPrice = round($item->cost / 2, 1);
        
        $this->db->beginTransaction();
        
        try {
            //для расходников уменьшаем количество (на последней удаляем), для остального шмота - сразу удаляем
            if (in_array($item->item_type, ['potion', 'arrow']) && $userItem->quantity > 1) {
                //уменьшаем количество расходника на 1
                $itemUpdated = $this->db->updateUserItemQuantity($character->id, $itemId, $userItem->quantity - 1);
                if (!$itemUpdated) {
                    $this->db->rollBack();
                    return ['error' => 4007];
                }
            } else {
                //удаление шмота
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

    //использование стрелы
    public function useArrow($userId) {
        //проверка пользователя
        $user = $this->checkUserExists($userId);
        if (is_array($user)) return $user;
        
        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;
        
        //проверка наличия лука
        $hasBow = $this->db->hasCharacterWeaponType($character->id, 'bow');
        if (!$hasBow) {
            return ['error' => 4008]; 
        }
        
        //проверка наличия стрел
        $hasArrows = $this->db->hasCharacterArrows($character->id);
        if (!$hasArrows) {
            return ['error' => 4009];
        }
        
        //используем стрелу
        return $this->useConsumables($character->id, 'arrow');
    }

    //использование хилок
    public function usePotion($userId) {
        //проверка пользователя
        $user = $this->checkUserExists($userId);
        if (is_array($user)) return $user;
        
        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;
        
        //проверка наличия хилок
        $hasPotions = $this->db->hasCharacterPotions($character->id);
        if (!$hasPotions) {
            return ['error' => 4010];
        }
        
        //используем схилку
        return $this->useConsumables($character->id, 'potion');
    }

    //получение всех предметов из игры
    public function getItemsData() {
        return $this->db->getAllItemsData();
    }
}
