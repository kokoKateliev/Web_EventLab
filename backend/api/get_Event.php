<?php

session_start();

require_once "../db/DB.php";
require_once "../models/Event.php";

function getEvent($connection, $FacultyID) {
    if (!isset($_SESSION['username'])) {
        return [
            'success' => false,
            'message' => "Потребителят не е влязъл в системата.",
            'events' => []
        ];
    }

    $username = $_SESSION['username'];

    $sqlForID = "SELECT 
                        u.id
                    FROM 
                        Users u
                    WHERE 
                        u.username = ?";

    $queryID = $connection->prepare($sqlForID);
    $queryID->execute([$username]);

    $row1 = $queryID->fetch(PDO::FETCH_ASSOC);
    $loggedUserID = $row1['id'];

    $sql = "SELECT 
                e.id,
                e.EventName,
                e.EventDateSt,
                e.Location,
                e.isAnonymous,
                e.EventDescription AS description,
                IF(e.isPersonalized, CONCAT(u.Firstname, ' ', u.Lastname), e.isPersonalized) AS isPersonalized,
                creatorTable.creator,
                p.isVisible,
                p.celebratorID
            FROM 
                Events e
            LEFT JOIN 
                (SELECT DISTINCT ue.EventID, CONCAT(c.Firstname, ' ', c.Lastname) AS creator
                FROM users_events ue
                LEFT JOIN Users c ON ue.usersID = c.id) AS creatorTable ON e.id = creatorTable.EventID
            LEFT JOIN 
                Personalized p ON p.EventID = e.id
            LEFT JOIN 
                Users u ON p.celebratorID = u.id
            LEFT JOIN 
                events_faculties ef ON e.id = ef.EventID
            WHERE 
                ef.FacultyID = ?
            GROUP BY 
                e.id";

        
    $query = $connection->prepare($sql);
    $query->execute([$FacultyID]); 


    $information = [];
    while($row = $query->fetch(PDO::FETCH_ASSOC)){
        if($row['isPersonalized'] === '0'){
            $information[] = array(
                'id' => $row['id'],
                'title' => $row['EventName'],
                'date' => $row['EventDateSt'],
                'location' => $row['Location'],
                'isPersonalized' => $row['isPersonalized'], 
                'description' => $row['description'],
                'creator' => $row['creator'],
                'isAnonymous' => $row['isAnonymous'],
                'isVisible' => $row['isVisible'],
                'isCelebrator' => false 
            );
        }
        else {
            if($row['celebratorID'] === $loggedUserID){
                $information[] = array(
                            'id' => $row['id'],
                            'title' => $row['EventName'],
                            'date' => $row['EventDateSt'],
                            'location' => $row['Location'],
                            'isPersonalized' => $row['isPersonalized'], 
                            'description' => $row['description'],
                            'creator' => $row['creator'],
                            'isAnonymous' => $row['isAnonymous'],
                            'isVisible' => $row['isVisible'],
                            'isCelebrator' => true 
                        );
            }
            else{
                $information[] = array(
                    'id' => $row['id'],
                    'title' => $row['EventName'],
                    'date' => $row['EventDateSt'],
                    'location' => $row['Location'],
                    'isPersonalized' => $row['isPersonalized'], 
                    'description' => $row['description'],
                    'creator' => $row['creator'],
                    'isAnonymous' => $row['isAnonymous'],
                    'isVisible' => $row['isVisible'],
                    'isCelebrator' => false 
                );
            }
        }
        
    }
    return $information;
} 

$phpInput = json_decode(file_get_contents('php://input'), true);

$FacultyID = $phpInput['facultyId'];

try{
    $db = new DB();
    $connection = $db->getConnection();
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => "Неуспешно свързване с базата данни!",
        'value' => null,
    ]);
    exit();
}

$information = getEvent($connection, $FacultyID);

echo json_encode([
'success' => true,
'message' => "Намерени са данни за събития към този факултет.",
'events' => $information,
]);

?>