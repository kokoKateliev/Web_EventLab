<?php

class User_Event {
    public $id;
    public $usersID;
    public $EventID;
    public $isAdmin;
    public $isHelper;
   
    function __construct($id, $usersID, $EventID, $isAdmin, $isHelper) {
        $this->id = $id;
        $this->usersID = $usersID;
        $this->EventID = $EventID;
        $this->isAdmin = $isAdmin;
        $this->isHelper = $isHelper;
    }

    public function storeInDB(): void {
        require_once "../db/DB.php";

        try{
            $db = new DB();
            $connection = $db->getConnection();
        }
        catch(PDOException $e){
            echo json_encode([
                'success' => false,
                'message' => "Неуспешно свързване с базата данни",
            ]);
        }

        $insertStatement = $connection->prepare("INSERT INTO `users_events` (usersID, EventID, isAdmin, isHelper)
        VALUES (:usersID, :EventID, :isAdmin, :isHelper)");

        $resultIns = $insertStatement->execute([
            'usersID' => $this->usersID,
            'EventID' => $this->EventID,
            'isAdmin' => $this->isAdmin,
            'isHelper' => $this->isHelper,
        ]);

        if (!$resultIns) {
            throw new Exception("Грешка при записването на информацията.");
        }
    }

    private function requiredFields($userID, $eventID, $isAdmin, $isHelper): bool {
        return !empty($userID) && !empty($eventID) && !empty($isAdmin) && !empty($isHelper);
    }

    private function validEventID($eventID): bool {
        require_once "../db/DB.php";

        $sql = "SELECT 
                    e.id
                FROM 
                    Events e
                WHERE 
                    e.EventID = ?";

        $query = $connetction->prepare($sql);
        $query->execute([$eventID]); 

        $evID = null;
        while($row = $query->fetch(PDO::FETCH_ASSOC)){
            $evID = $row['id']; 
        }

        if ($evID === null) {
            return false;
        } 

        return true; 
    }

    private function validUserID($userID): bool {
        require_once "../db/DB.php";

        $sql = "SELECT 
                    u.id
                FROM 
                    Users u
                WHERE 
                    u.id = ?";

        $query = $connetction->prepare($sql);
        $query->execute([$userID]); 

        $usID = null;
        while($row = $query->fetch(PDO::FETCH_ASSOC)){
            $usID = $row['id'];
        }

        if ($usID === null) {
            return false;
        } 

        return true; 
    }

    private function validRole($role): bool {
        return (int)$role === 0 || (int)$role === 1;
    }

    public function validate(): void {
        if(!$this->requiredFields($this->usersID, $this->EventID, $this->isAdmin, $this->isHelper)){
            throw new Exception("Всички полета са задължителни!");
        }
        if(!$this->validEventID($this->EventID)){
            throw new Exception("Грешно id на Event!");
        }
        if(!$this->validUserID($this->usersID)){
            throw new Exception("Грешно id на User!");
        }
        if(!$this->validRole($this->isAdmin)){
            throw new Exception("Грешна роля на админ!");
        }
        if(!$this->validRole($this->isHelper)){
            throw new Exception("Грешна роля на помощник!");
        }
    }
}

?>