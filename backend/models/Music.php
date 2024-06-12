<?php

class Music {
    public $id;
    public $senderID;
    public $title;
    public $musicURL;
    public $EventID;
   
    function __construct($id = null, $senderID = null, $title = null, $musicURL = null, $EventID = null) {
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

    public function deleteMusicInDB(): void {
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
  
        $musicURL = $this->getMusicURL($connection, $this->id);

        $deleteStatement = $connection->prepare("DELETE FROM `Music` WHERE `id` = :musicID");

        $resultDel = $deleteStatement->execute([
            'musicID' => $this->id
        ]);

        if (!$resultDel) {
            throw new Exception("Грешка при записването на информацията.");
        }

        $musicPath = realpath(__DIR__ . '/../../files/upload_audio/' . $musicURL);
        
        if (file_exists($musicPath)) {
            if (!unlink($musicPath)) {
                throw new Exception("Грешка при изтриването на музиката.");
            }
        }
    }

    private function getMusicURL($connection, $musicID) {
        $query = $connection->prepare("SELECT musicURL FROM `Music` WHERE `id` = :id");
        $query->execute(['id' => $musicID]);
    
        $row = $query->fetch(PDO::FETCH_ASSOC);
    
        if ($row === false) {
            throw new Exception("Грешка при намирането на пътя на изображението.");
        }
    
        return $row['musicURL'];
    }
}

?>