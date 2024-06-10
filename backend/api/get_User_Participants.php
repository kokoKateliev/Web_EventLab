<?php

session_start();

require_once "../db/DB.php";

function getUserParticipants($connetction, $EventID) {
    $sql = "SELECT 
            u.id AS userID,
            CONCAT(u.Firstname, ' ', u.Lastname) AS name,
            ue.isHelper,
            ue.isAdmin
    FROM 
        users_events ue
    LEFT JOIN 
        Users u ON ue.usersID = u.id
    WHERE 
        ue.EventID = ?";

    $query = $connetction->prepare($sql);
    $query->execute([$EventID]); 

    while($row = $query->fetch(PDO::FETCH_ASSOC)){
        $information[] =  array( [
            'id' => $row['userID'],
            'name' => $row['name'],
            'isHelper' => $row['isHelper'],
            'isAdmin' => $row['isAdmin']
        ]);
    }
    return $information;
} 

$phpInput = json_decode(file_get_contents('php://input'), true);

$EventID = $phpInput['id'];  //eventID

try{
    $db = new DB();
    $connetction = $db->getConnection();
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => "Неуспешно свързване с базата данни!",
        'userParticipants' => null,
    ]);
    exit();
}

$information = getUserParticipants($connetction, $EventID);

if(!$information){
    echo json_encode([
        'success' => false,
        'message' => "Няма намерени данни участници.",
        'userParticipants' => $information,
    ]);
} else {
    echo json_encode([
        'success' => true,
        'message' => "Намерени са данни за участници.",
        'userParticipants' => $information,
    ]);
}
?>
