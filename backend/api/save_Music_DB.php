<?php

session_start();

require_once "../db/DB.php";
require_once "../models/Music.php";

function saveMusic($connection, $eventId, $title, $musicURL) {
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

    $music = new Music(null, $loggedUserID, $title, $musicURL, $eventId)
}

$phpInput = json_decode(file_get_contents('php://input'), true);
$EventID = $phpInput['eventId']; 
$title = $phpInput['name']; 
$musicURL = basename($phpInput['musicURL']);  // check if in js is given 'musicURL'

try{
    $music = saveMusic($connection, $EventID, $title, $musicURL);
    $music->storeInDB();
    echo json_encode(['success' => true]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
