<?php
require_once('application/config.php');
require_once('Answer.php');

class Classes {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // Получение всех доступных классов
    public function getClasses() {
        $classes = $this->db->getAllPersonClasses();
        if (!$classes) return Answer::error(3001);
        return $classes;
    }

    // Покупка класса пользователем
    public function buyClass($userId, $classId) {
        $user = checkUser($this->db, $userId);
        $character = checkCharacter($this->db, $userId);

        $class = $this->db->getPersonClassById($classId);
        if (!$class) return Answer::error(3002);

        $owned = $this->db->getUserPersonClass($userId, $classId);
        if ($owned) return Answer::error(3006);

        if ($character->money < $class->cost) return Answer::error(3003);

        $successMoney = $this->db->updateCharacterMoneySubtract($character->id, $class->cost);
        if (!$successMoney) return Answer::error(3010);

        $successClass = $this->db->addUserPersonClass($userId, $classId);
        if (!$successClass) return Answer::error(3011);

        return ['success' => true];
    }

    // Выбор класса пользователем
    public function selectClass($userId, $classId) {
        $user = checkUser($this->db, $userId);
        $character = checkCharacter($this->db, $userId);

        $owned = $this->db->getUserPersonClass($userId, $classId);
        if (!$owned) return Answer::error(3005);

        $current = $this->db->getUserSelectedPersonClass($userId);
        if ($current && $current->class_id == $classId) return Answer::error(3012);

        $this->db->clearSelectedUserClasses($userId);
        $success = $this->db->setUserSelectedPersonClass($userId, $classId);
        if (!$success) return Answer::error(3011);

        return ['success' => true];
    }
}
