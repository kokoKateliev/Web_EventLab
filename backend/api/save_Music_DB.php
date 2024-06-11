<?php

session_start();

require_once "../db/DB.php";
require_once "../models/Music.php";

function getSenderID($connection){
    if (!isset($_SESSION['username'])) {
        throw new Exception("Няма логнат потребител!");
    }

    $username = $_SESSION['username'];
    
    $sql = "SELECT 
               u.id
            FROM 
                Users u
            WHERE 
                u.username = ?";

    $query = $connection->prepare($sql);
    $query->execute([$username]);

    $row = $query->fetch(PDO::FETCH_ASSOC);
    if ($row === false) {
        throw new Exception("Потребителят не е намерен.");
    }

    $loggedUserID = $row['id'];

    return $loggedUserID;
}

try {
    $phpInput = json_decode(file_get_contents('php://input'), true);
    
    if ($phpInput === null) {
        throw new Exception("Невалиден JSON вход.");
    }

    $db = new DB();
    $connection = $db->getConnection();
    $senderID = getSenderID($connection);

    if (!isset($phpInput['eventId'])) {
        throw new Exception("Липсва необходима информация eventId!");
    }
    if (!isset($phpInput['name'])) {
        throw new Exception("Липсва необходима информация name!");
    }
    if (!isset($phpInput['musicURL'])) {
        throw new Exception("Липсва необходима информация musicURL!");
    }

    $EventID = $phpInput['eventId']; 
    $title = $phpInput['name']; 
    $musicURL = basename($phpInput['musicURL']);
    
    $music = new Music(null, $senderID, $title, $musicURL, $EventID);
    $music->storeInDB();
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => "Неуспешно свързване с базата данни!",
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

