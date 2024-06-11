<?php

require_once "../db/DB.php";
require_once "../models/Event.php";

function getEvent($connetction, $FacultyID) {
    $sql = "SELECT 
            e.id,
            e.EventName,
            e.EventDateSt,
            e.Location,
            e.isAnonymous,
            e.EventDescription AS description,
            IF(e.isPersonalized, CONCAT(u.Firstname, ' ', u.Lastname), e.isPersonalized) AS isPersonalized,
            CONCAT(c.Firstname, ' ', c.Lastname) AS creator
    FROM 
        Events e
    LEFT JOIN 
        users_events ue ON e.id = ue.EventID
        LEFT JOIN
        personalized p ON p.EventID = e.id
    LEFT JOIN 
        Users u ON p.celebratorID = u.id 
    LEFT JOIN 
        Users c ON e.id = c.id
    LEFT JOIN 
        events_faculties ef ON e.id = ef.EventID
    WHERE 
        ef.FacultyID = ?";

        
    $query = $connetction->prepare($sql);
    $query->execute([$FacultyID]); 

    $information = null;
    while($row = $query->fetch(PDO::FETCH_ASSOC)){
        $information[] = array(
            'id' => $row['id'],
            'title' => $row['EventName'],
            'date' => $row['EventDateSt'],
            'location' => $row['Location'],
            'isPersonalized' => $row['isPersonalized'], 
            'description' => $row['description'],
            'creator' => $row['creator'],
            'isAnonymous' => $row['isAnonymous']
        );
    }
    return $information;
} 

$phpInput = json_decode(file_get_contents('php://input'), true);

$FacultyID = $phpInput['facultyId'];

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
        'events' => $information,
    ]);
} else {
    echo json_encode([
    'success' => true,
    'message' => "Намерени са данни за събития към този факултет.",
    'events' => $information,
    ]);
}

?>