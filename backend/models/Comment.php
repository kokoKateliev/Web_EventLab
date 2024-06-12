<?php

class Comment {
    public $id;
    public $CommentText;
    public $CommentDate;
    public $EventID;
    public $UserID;
   
    function __construct($id, $CommentText, $CommentDate, $EventID, $UserID) {
        $this->id = $id;
        $this->CommentText = $CommentText;
        $this->CommentDate = $CommentDate;
        $this->EventID = $EventID;
        $this->UserID = $UserID;
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

        $insertStatement = $connection->prepare("INSERT INTO `Comments` (CommentText, CommentDate, EventID, UserID)
        VALUES (:CommentText, :CommentDate, :EventID, :UserID)");

        $resultIns = $insertStatement->execute([
            'CommentText' => $this->CommentText,
            'CommentDate' => $this->CommentDate,
            'EventID' => $this->EventID,
            'UserID' => $this->UserID,
        ]);

        if (!$resultIns) {
            throw new Exception("Грешка при записването на информацията.");
        }
    }

    private function requiredFields($text): bool {
        return !empty($text);
    }

    private function validTitle($title): bool{
        return strlen($title) < 30;	
	}


    private function validEventID($eventID): bool {
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

        $sql = "SELECT 
                    e.id
                FROM 
                    Events e
                WHERE 
                    e.id = ?";

        $query = $connection->prepare($sql);
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

        $sql = "SELECT 
                    u.id
                FROM 
                    Users u
                WHERE 
                    u.id = ?";

        $query = $connection->prepare($sql);
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

    public function validate(): void {
        if(!$this->requiredFields($this->CommentText)){
            throw new Exception("Полето за текст е задължително!");
        }
        if(!$this->validEventID($this->EventID)){
            throw new Exception("Грешно id на Event!");
        }
        if(!$this->validUserID($this->UserID)){
            throw new Exception("Грешно id на User!");
        }
    }
}

?>