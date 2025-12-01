<?php
require_once('application/Config.php');

class Classes {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // Получение всех доступных классов
    public function getClasses() {
        $classes = $this->db->getAllPersonClasses();
        if (!$classes || count($classes) === 0) return Answer::error(3001);
        return $classes;
    }

    // Получение классов, которые уже принадлежат пользователю
    public function getUserOwnedClasses($userId) {
        $user = checkUser($this->db, $userId);
        if (!$user) return Answer::error(705);

        $classes = $this->db->getUserOwnedClasses($userId);
        if (!$classes || count($classes) === 0) return Answer::error(3001);
        return $classes;
    }

    // Покупка класса пользователем
    public function buyClass($userId, $classId) {
        $user = checkUser($this->db, $userId);
        if (!$user) return Answer::error(705);

        $class = $this->db->getPersonClassById($classId);
        if (!$class) return Answer::error(3002);

        $owned = $this->db->getUserPersonClass($userId, $classId);
        if ($owned) return Answer::error(3006);

        $character = checkCharacter($this->db, $userId);
        if (!$character) return Answer::error(706);

        if ($character->money < $class->cost) return Answer::error(3003);

        return wrapTransaction($this->db, function() use ($class, $character, $userId, $classId) {
            $deducted = $this->db->updateCharacterMoneySubtract($character->id, $class->cost);
            if (!$deducted) return Answer::error(3010);

            $added = $this->db->addUserPersonClass($userId, $classId);
            if (!$added) return Answer::error(3011);

            return ['success' => true];
        });
    }

    // Выбор класса пользователем
    public function selectClass($userId, $classId) {
        $user = checkUser($this->db, $userId);
        if (!$user) return Answer::error(705);

        $character = checkCharacter($this->db, $userId);
        if (!$character) return Answer::error(706);

        $current = $this->db->getUserSelectedPersonClass($userId);
        if ($current && $current->id == $classId) return Answer::error(3012);

        $owned = $this->db->getUserPersonClass($userId, $classId);
        if (!$owned) return Answer::error(3005);

        return wrapTransaction($this->db, function() use ($userId, $classId) {
            $cleared = $this->db->clearSelectedUserClasses($userId);
            if (!$cleared) return Answer::error(3009);

            $selected = $this->db->setUserSelectedPersonClass($userId, $classId);
            if (!$selected) return Answer::error(3009);

            return ['success' => true];
        });
    }
}
