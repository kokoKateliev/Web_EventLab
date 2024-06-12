<?php

class Event {
    public $id;
    public $eventName;
    public $eventDescription;
    public $eventDateStart;
    public $eventDateEnd;
    public $eventTimeStart;
    public $eventTimeEnd;
    public $location;
    public $isAnonymous;
    public $isPersonalized;

    function __construct($id, $eventName, $eventDescription, $eventDateStart, $eventDateEnd,
    $eventTimeStart, $eventTimeEnd, $location, $isAnonymous, $isPersonalized) {
        $this->id = $id;
        $this->eventName = $eventName;
        $this->eventDescription = $eventDescription;
        $this->eventDateStart = $eventDateStart;
        $this->eventDateEnd = $eventDateEnd;
        $this->eventTimeStart = $eventTimeStart;
        $this->eventTimeEnd = $eventTimeEnd;
        $this->location = $location;
        $this->isAnonymous = $isAnonymous;
        $this->isPersonalized = $isPersonalized;
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

        $insertStatement = $connection->prepare("INSERT INTO `Events` (EventName, EventDescription, EventDateSt, EventDateEn, EventTimeSt, EventTimeEn, Location, isAnonymous, isPersonalized)
        VALUES (:EventName, :EventDescription, :EventDateSt, :EventDateEn, :EventTimeSt, :EventTimeEn, :Location, :isAnonymous, :isPersonalized)");

        $resultIns = $insertStatement->execute([
            'EventName' => $this->eventName,
            'EventDescription' => $this->eventDescription,
            'EventDateSt' => $this->eventDateStart,
            'EventDateEn' => $this->eventDateEnd,
            'EventTimeSt' => $this->eventTimeStart,
            'EventTimeEn' => $this->eventTimeEnd,
            'Location' => $this->location,
            'isAnonymous' => $this->isAnonymous,
            'isPersonalized' => $this->isPersonalized,
        ]);

        if (!$resultIns) {
            throw new Exception("Грешка при записването на информацията.");
        }
    }

    private function requiredFields($eventName, $eventDescription, $eventDateStart, $eventDateEnd, $eventTimeStart, $eventTimeEnd, $location, $isAnonymous, $isPersonalized): bool {
      return !empty($eventName) && !empty($eventDescription) && !empty($eventDateStart) && !empty($eventDateEnd) && !empty($eventTimeStart) && !empty($eventTimeEnd) && !empty($location) && !empty($isAnonymous) && !empty($isPersonalized);
    }

    private function validName($name): bool{
      return strlen($name) >= 2 && strlen($name) <= 50 && (preg_match('/^[\p{Cyrillic}]+[- \']?[\p{Cyrillic}]+$/u', $field) || preg_match('/^[a-zA-Z]+[- \']?[a-zA-Z]+$/', $name));	
    }

    public function validate(): void {
        if(!$this->requiredFields($this->eventName, $this->eventDescription, $this->eventDateStart, $this->eventDateEnd, $this->eventTimeStart, $this->eventTimeEnd, $this->location, $this->isAnonymous, $this->isPersonalized )){
            throw new Exception("Всички полета са задължителни!");
        }
    }

    // to be added validation
}

?>
