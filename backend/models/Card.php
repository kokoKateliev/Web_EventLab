<?php

class Card {
    public $id;
    public $senderID;
    public $description;
    public $imgURL;
    public $EventID;
   
    function __construct($id = null, $senderID = null, $description = null, $imgURL = null, $EventID = null) {
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

        $insertStatement = $connection->prepare("INSERT INTO `Cards` (senderID, description, imgURL, EventID)
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

    public function deleteCardInDB(): void {
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
  
        $imgURL = $this->getImgURL($connection, $this->id);

        $deleteStatement = $connection->prepare("DELETE FROM `Cards` WHERE `id` = :cardID");

        $resultDel = $deleteStatement->execute([
            'cardID' => $this->id
        ]);

        if (!$resultDel) {
            throw new Exception("Грешка при записването на информацията.");
        }

        $imagePath = realpath(__DIR__ . '/../../files/upload_image/' . $imgURL);
        
        if (file_exists($imagePath)) {
            if (!unlink($imagePath)) {
                throw new Exception("Грешка при изтриването на изображението.");
            }
        }
    }

    private function getImgURL($connection, $cardID) {
        $query = $connection->prepare("SELECT imgURL FROM `Cards` WHERE `id` = :id");
        $query->execute(['id' => $cardID]);
    
        $row = $query->fetch(PDO::FETCH_ASSOC);
    
        if ($row === false) {
            throw new Exception("Грешка при намирането на пътя на изображението.");
        }
    
        return $row['imgURL'];
    }
}

?>