<?php

class Event {
    public $id;
    public $senderID;
    public $description;
    public $imgURL;
    public $EventID;
   
    function __construct($id, $senderID, $description, $imgURL, $EventID) {
        $this->id = $id;
        $this->senderID = $senderID;
        $this->description = $description;
        $this->imgURL = $imgURL;
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

        $insertStatement = $connection->prepare("INSERT INTO `Cards` (senderID, description, imgURL)
        VALUES (:senderID, :description, :imgURL, :EventID)");

        $resultIns = $insertStatement->execute([
            'senderID' => $this->senderID,
            'description' => $this->description,
            'imgURL' => $this->imgURL,
            'EventID' => $this->EventID,
        ]);

        if (!$resultIns) {
            throw new Exception("Грешка при записването на информацията.");
        }
    }
}

?>