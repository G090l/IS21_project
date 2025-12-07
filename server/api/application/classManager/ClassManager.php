<?php

class ClassManager extends BaseManager {
    
    //получение классов из базы
    public function getClasses() {
        return $this->db->getAllPersonClasses();
    }

    //покупка класса
    public function buyClass($userId, $classId) {
        //проверка пользователя
        $user = $this->checkUserExists($userId);
        if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;
        
        //проверка существования класса
        $class = $this->db->getPersonClassById($classId);
        if (!$class) {
            return ['error' => 3001];
        }
        
        //проверка, не куплен ли уже класс
        $owned = $this->db->getUserPersonClass($userId, $classId);
        if ($owned) {
            return ['error' => 3002];
        }
        
        //проверка достаточности денег
        if ($character->money < $class->cost) {
            return ['error' => 3003];
        }

        //покупка класса
        try {
            $this->db->beginTransaction();
            
            $moneyUpdated = $this->db->updateCharacterMoneySubtract($character->id, $class->cost);
            if (!$moneyUpdated) {
                $this->db->rollBack();
                return ['error' => 3004];
            }
            
            $classAdded = $this->db->addUserPersonClass($userId, $classId);
            if (!$classAdded) {
                $this->db->rollBack();
                return ['error' => 3004];
            }
            
            $this->db->commit();
            return true;
            
        } catch (Exception $e) {
            $this->db->rollBack();
            return ['error' => 3004];
        }
    }

    //селект класса
    public function selectClass($userId, $classId) {
        //проверка пользователя
        $user = $this->checkUserExists($userId);
        if (is_array($user)) return $user;

        //проверка персонажа
        $character = $this->checkCharacterExists($userId);
        if (is_array($character)) return $character;
        
        //проверка, что класс принадлежит пользователю
        $owned = $this->db->getUserPersonClass($userId, $classId);
        if (!$owned) {
            return ['error' => 3005];
        }

        //проверка, что класс уже выбран
        if ($owned->selected == 1) {
            return ['error' => 3006]; 
        }

        //выбор класса
        $this->db->clearSelectedUserClasses($userId);
        $this->db->setUserSelectedPersonClass($userId, $classId);
        return true;
    }
}



