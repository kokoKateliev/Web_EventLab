<?php

class Personalized {
    public $id;
    public $EventID;
    public $isVisible;
    public $celebratorID;
    public $Amount;
   
    function __construct($id, $EventID, $isVisible, $celebratorID, $Amount) {
        $this->id = $id;
        $this->EventID = $EventID;
        $this->isVisible = $isVisible;
        $this->celebratorID = $celebratorID;
        $this->Amount = $Amount;
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

        $insertStatement = $connection->prepare("INSERT INTO `Personalized` (EventID, isVisible, celebratorID, Amount)
        VALUES (:EventID, :isVisible, :celebratorID, :Amount)");

        $resultIns = $insertStatement->execute([
            'EventID' => $this->EventID,
            'isVisible' => $this->isVisible,
            'celebratorID' => $this->celebratorID,
            'Amount' => $this->Amount,
        ]);

        if (!$resultIns) {
            throw new Exception("Грешка при записването на информацията.");
        }
    }

    public function updateAmountInDB(): void {
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

        $uploadStatement = $connection->prepare("UPDATE `Personalized` SET `Amount` = :newAmount WHERE `EventID` = :eventID");

        $resultIns = $uploadStatement->execute([
            'newAmount' => $this->Amount,
            'eventID' => $this->EventID,
        ]);

        if (!$resultIns) {
            throw new Exception("Грешка при записването на информацията.");
        }
    }

    private function requiredFields($EventID, $isVisible, $celebratorID, $Amount): bool {
        return !empty($EventID) && !empty($isVisible) && !empty($celebratorID) && !empty($Amount);
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

    private function validUserID($celebratorID): bool {
        require_once "../db/DB.php";

        $sql = "SELECT 
                    u.id
                FROM 
                    Users u
                WHERE 
                    u.id = ?";

        $query = $connetction->prepare($sql);
        $query->execute([$celebratorID]); 

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
        if(!$this->requiredFields($this->EventID, $this->isVisible, $this->celebratorID, $this->Amount)){
            throw new Exception("Всички полета са задължителни!");
        }
        if(!$this->validEventID($this->EventID)){
            throw new Exception("Грешно id на Event!");
        }
        if(!$this->validUserID($this->celebratorID)){
            throw new Exception("Грешно id на Celebratoor!");
        }
        if(!$this->validRole($this->isVisible)){
            throw new Exception("Грешна опция за visible!");
        }
       
    }
}

?>