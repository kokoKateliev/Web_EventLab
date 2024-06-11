<?php

class Present {
    public $id;
    public $Title;
    public $Price;
    public $EndDate;
    public $EventID;
   
    function __construct($id, $Title, $Price, $EndDate, $EventID) {
        $this->id = $id;
        $this->Title = $Title;
        $this->Price = $Price;
        $this->EndDate = $EndDate;
        $this->EventID = $EventID;
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

        $insertStatement = $connection->prepare("INSERT INTO `Presents` (Title, Price, EndDate, EventID)
        VALUES (:Title, :Price, :EndDate, :EventID)");

        $resultIns = $insertStatement->execute([
            'Title' => $this->Title,
            'Price' => $this->Price,
            'EndDate' => $this->EndDate,
            'EventID' => $this->EventID,
        ]);

        if (!$resultIns) {
            throw new Exception("Грешка при записването на информацията.");
        }
    }

    private function requiredFields($title, $price, $endDate, $eventID): bool {
        return !empty($title) && !empty($price) && !empty($endDate) && !empty($eventID);
    }

    private function validTitle($title): bool{
        return strlen($title) < 30;	
	}

    private function validDate($dateTime): bool {
        $format = 'Y-m-d';
        $d = DateTime::createFromFormat($format, $dateTime); 
        $currentDate = new DateTime();
        return $d && $d > $currentDate; 
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
            $evID = $row['id'] 
        }

        if ($evID === null) {
            return false;
        } 

        return true; 
    }

    public function validate(): void {
        if(!$this->requiredFields($this->Title, $this->Price, $this->EndDate, $this->EventID)){
            throw new Exception("Всички полета са задължителни!");
        }
        if(!$this->validTitle($this->Title)){
            throw new Exception("Попълнете валидно заглавие!");
        }
        if(!$this->validDate($this->EndDate)){
            throw new Exception("Попълнете валидна дата!");
        }
        if(!$this->validEventID($this->EventID)){
            throw new Exception("Грешно id на Event!");
        }

    }

}

?>