<?php

session_start();

require_once "../db/DB.php";

<?php
session_start();

require_once "../db/DB.php";
require_once "../models/User_Event.php";
require_once "../models/Event_Faculty.php";
require_once "../models/Event.php";
require_once "../models/Personalized.php";


function getCreatorID($connection){
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

    $userID = $row['id'];

    return $userID;
}

try {
    $phpInput = json_decode(file_get_contents('php://input'), true);
    
    if ($phpInput === null) {
        throw new Exception("Невалиден JSON вход.");
    }

    $db = new DB();
    $connection = $db->getConnection();
    $creatorID = getCreatorID($connection);

    // if (!isset($phpInput['id'])) {
    //     throw new Exception("Липсва необходима информация eventId!");
    // }

   // $eventId = $phpInput['id'];
    
    $event = new Event(null, )

    $user_event = new User_Event(null, $senderID, $eventId, 0, 0);
    $user_event->storeInDB();
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => "Неуспешно свързване с базата данни!",
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>