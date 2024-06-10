<?php

require_once "../db/DB.php";
require_once "../models/Event.php";
// session_start();
// $email=$_SESSION['email']
function getEvent($connetction, $FacultyID) {
    $sql = "SELECT 
            e.id,
            e.EventName,
            e.EventDateSt,
            e.Location,
            e.isAnonymous,
            e.EventDescription AS description,
            IF(e.isPersonalized, CONCAT(u.Firstname, ' ', u.Lastname), NULL) AS isPersonalized,
            CONCAT(c.Firstname, ' ', c.Lastname) AS creator
    FROM 
        Events e
    LEFT JOIN 
        users_events ue ON e.id = ue.EventID
    LEFT JOIN 
        Users u ON ue.usersID = u.id 
    LEFT JOIN 
        Users c ON e.id = c.id
    LEFT JOIN 
        events_faculties ef ON e.id = ef.EventID
    WHERE 
        ef.FacultyID = :FacultyID";

        
    $query = $connetction->prepare($sql);
    $query->execute(['FacultyID' => $FacultyID]);

    while($row = $query->fetch()){
        $information[] = array(
            'id' => $row['id'],
            'eventName' => $row['EventName'],
            'eventDateSt' => $row['EventDateSt'],
            'location' => $row['Location'],
            'isPersonalized' => $row['isPersonalized'] ? $row['celebrator_firstname'] . ' ' . $row['celebrator_lastname'] : null,
            'description' => $row['description'],
            'creator' => $row['creator_firstname'] . ' ' . $row['creator_lastname'],
            'isAnonymous' => $row['isAnonymous']
        );
    }
    return $information;
} 

$phpInput = json_decode(file_get_contents('php://input'), true);

$FacultyID = $phpInput['FacultyID'];

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

$information = getEvent($connetction, $FacultyID);

if(!$information){
    echo json_encode([
        'success' => false,
        'message' => "Няма намерени данни за събития за избрания факултет.",
        'value' => $information,
    ]);
} else {
    echo json_encode([
    'success' => true,
    'message' => "Намерени са данни за събития към този факултет.",
    'value' => $information,
    ]);
}

?>