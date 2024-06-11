<?php

class Music {
    public $id;
    public $senderID;
    public $title;
    public $musicURL;
    public $EventID;
   
    function __construct($id, $senderID, $title, $musicURL, $EventID) {
        $this->id = $id;
        $this->senderID = $senderID;
        $this->title = $title;
        $this->musicURL = $musicURL;
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

        $insertStatement = $connection->prepare("INSERT INTO `Music` (senderID, title, musicURL, EventID)
        VALUES (:senderID, :title, :musicURL, :EventID)");

        $resultIns = $insertStatement->execute([
            'senderID' => $this->senderID,
            'title' => $this->title,
            'musicURL' => $this->musicURL,
            'EventID' => $this->EventID,
        ]);

        if (!$resultIns) {
            throw new Exception("Грешка при записването на информацията.");
        }
    }
}

?>