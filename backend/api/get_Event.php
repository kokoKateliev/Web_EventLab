<?php

require_once "../db/DB.php";
require_once "../models/Event.php";

function getEvent($connetction, $FacultyID) {
    $sql = "SELECT 
        e.id,
        e.EventName,
        e.EventDateSt,
        e.Location,
        e.isPersonalized,
        p.Firstname AS celebrator_firstname,
        p.Lastname AS celebrator_lastname,
        e.EventDescription AS description,
        u.Firstname AS creator_firstname,
        u.Lastname AS creator_lastname,
        e.isAnonymous
    FROM 
        Events e
    JOIN 
        events_faculties ef ON e.id = ef.EventID
    LEFT JOIN 
        Personalized pz ON e.id = pz.EventID
    LEFT JOIN 
        Users p ON pz.celebratorID = p.id
    JOIN 
        Users u ON u.id = (SELECT usersID FROM users_events WHERE EventID = e.id AND isAdmin = 1 LIMIT 1)
    WHERE 
        ef.FacultyID = :FacultyID";

        
    $query = $connetction->prepare($sql);
    $query->execute(['FacultyID' => $FacultyID]);

    while($row = $query->fetch()){
        // $id = $row['id'];
        // $title = $row['EventName'];
        // $date = $row['EventDateSt'];
        // $location = $row['Location'];
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

if (isset($_SESSION['FacultyID'])) {
    $facultyID = $_SESSION['FacultyID'];
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
    
}


$information = getEvent($connetction, $facultyID);
echo json_encode([
    'success' => true,
    'message' => "Информация за събитие.",
    'value' => $information,
]);

?>