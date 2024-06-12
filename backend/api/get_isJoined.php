<?php

session_start();

require_once "../db/DB.php";

function getIsJoined($connection, $eventID) {
    $username = $_SESSION['username'];

    $sql = "SELECT 
               u.id
            FROM 
                Users u
            WHERE 
                u.username = ?";

    $query = $connection->prepare($sql);
    $query->execute([$username]);

    while($row = $query->fetch(PDO::FETCH_ASSOC)){ 
        $loggedUserID = $row['id'];
    } 

    $sqlIsJoined = "SELECT
                       ue.usersID 
                   FROM 
                       users_events ue
                   WHERE
                       ue.EventID = ?";

    $queryIsJoined = $connection->prepare($sqlIsJoined);
    $queryIsJoined->execute([$eventID]);
    
    $information = [];
    while($row1 = $queryIsJoined->fetch(PDO::FETCH_ASSOC)){ 
        $information = $row1['usersID'];
    } 

    return $information;
}

$phpInput = json_decode(file_get_contents('php://input'), true);

try{
    $db = new DB();
    $connetction = $db->getConnection();
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => "Неуспешно свързване с базата данни!",
        'value' => null,
    ]);
    exit();
}

$eventID = $phpInput['eventId'];
$information = getIsJoined($connetction, $eventID);


if(!$information){
    echo json_encode([
        'success' => true,
        'isJoined' => false,
    ]);
} else {
    echo json_encode([
        'success' => true,
        'isJoined' => true,
    ]);
}

?>