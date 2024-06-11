<?php

session_start();

require_once "../db/DB.php";
require_once "../models/Card.php";

function saveCard($connection, $eventId, $name, $photo) {
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

    $card = new Card(null, $loggedUserID, $name, $photo, $eventId);
}

$phpInput = json_decode(file_get_contents('php://input'), true);
$EventID = $phpInput['eventId']; 
$name = $phpInput['name']; 
$photo = basename($phpInput['photo']); 

// try{
//     $db = new DB();
//     $connetction = $db->getConnection();
// } catch (PDOException $e) {
//     echo json_encode([
//         'success' => false,
//         'message' => "Неуспешно свързване с базата данни!",
//         'value' => null,
//     ]);
//     exit();
// }

try{
    $card = saveCard($connection, $EventID, $name, $photo);
    $card->storeInDB();
    echo json_encode(['success' => true]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
