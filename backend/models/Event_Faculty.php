<?php

class Event_Faculty {
    public $id;
    public $EventID;
    public $FacultyID;
    public $isGlobal;
   
    function __construct($id, $EventID, $FacultyID, $isGlobal) {
        $this->id = $id;
        $this->EventID = $EventID;
        $this->FacultyID = $FacultyID;
        $this->isGlobal = $isGlobal;
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

        $insertStatement = $connection->prepare("INSERT INTO `events_faculties` (EventID, FacultyID, isGlobal)
        VALUES (:EventID, :FacultyID, :isGlobal)");

        $resultIns = $insertStatement->execute([
            'EventID' => $this->EventID,
            'FacultyID' => $this->FacultyID,
            'isGlobal' => $this->isGlobal,
        ]);

        if (!$resultIns) {
            throw new Exception("Грешка при записването на информацията.");
        }
    }

    private function requiredFields($EventID, $FacultyID, $isGlobal): bool {
        return !empty($EventID) && !empty($FacultyID) && !empty($isGlobal);
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

    private function validFacultyID($facultyID): bool {
        require_once "../db/DB.php";

        $sql = "SELECT 
                    f.id
                FROM 
                    Faculties f
                WHERE 
                    f.id = ?";

        $query = $connetction->prepare($sql);
        $query->execute([$facultyID]); 

        $fID = null;
        while($row = $query->fetch(PDO::FETCH_ASSOC)){
            $fID = $row['id'];
        }

        if ($fID === null) {
            return false;
        } 

        return true; 
    }

    private function validRole($role): bool {
        return (int)$role === 0 || (int)$role === 1;
    }

    public function validate(): void {
        if(!$this->requiredFields($this->EventID, $this->FacultyID, $this->isGlobal)){
            throw new Exception("Всички полета са задължителни!");
        }
        if(!$this->validEventID($this->EventID)){
            throw new Exception("Грешно id на Event!");
        }
        if(!$this->validFacultyID($this->FacultyID)){
            throw new Exception("Грешно id на Faculty!");
        }
        if(!$this->validRole($this->isGlobal)){
            throw new Exception("Грешна опция за isGlobal!");
        }
    }
}

?>