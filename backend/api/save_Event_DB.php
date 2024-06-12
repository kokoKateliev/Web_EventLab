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

function getCelebratorID($connection, $email) {

    $sql = "SELECT 
               u.id
            FROM 
                Users u
            WHERE 
                u.Email = ?";

    $query = $connection->prepare($sql);
    $query->execute([$email]);

    $row = $query->fetch(PDO::FETCH_ASSOC);

    if ($row === false) {
        throw new Exception("Имейлът на празнуващия не е намерен.");
    }

    $userID = $row['id'];

    return $userID;
}

$phpInput = json_decode(file_get_contents('php://input'), true);


try {
    if ($phpInput === null) {
        throw new Exception("Невалиден JSON вход.");
    }

    try {
        $db = new DB();
        $connection = $db->getConnection();

        // Start a transaction
       

        $creatorID = getCreatorID($connection);
        
        $event = new Event(null, $phpInput['EventName'], $phpInput['EventDescription'], $phpInput['EventDateSt'], 
                $phpInput['EventDateEn'], $phpInput['EventTimeSt'], $phpInput['EventTimeEn'], $phpInput['location'], 
                (int)$phpInput['isAnonnymus'], (int)$phpInput['isPersonalized']);
        
        $event->storeInDB();

        $connection->beginTransaction();

        $isPersonalized =  $phpInput['isPersonalized'];

        $sqlEventID = "SELECT 
                    e.id
                FROM 
                    Events e
                WHERE 
                    e.EventName = ? AND e.EventDescription = ?";
        
        $query2 = $connection->prepare($sqlEventID);
        $query2->execute([$phpInput['EventName'], $phpInput['EventDescription']]);

        $row2 = $query2->fetch(PDO::FETCH_ASSOC);

        if ($row2 === false) {
            throw new Exception("ID на Event не е намерен.");
        }

        $eventIDNew = $row2['id'];

        if($isPersonalized){
            $celebratorID = getCelebratorID($connection, $phpInput['celebratorEmail']);
            $personalized = new Personalized(null, $eventIDNew, (int)$phpInput['isVisible'],  $celebratorID, 0);
            $personalized->storeInDB();

            $celebratorUser = new User_Event(null, $celebratorID, $eventIDNew, 0, 0);
            $celebratorUser->storeInDB();
        }
        
        $user = new User_Event(null, $creatorID, $eventIDNew, 1, 0);
        $user->storeInDB();
        
        $event_faculty = new Event_Faculty(null, $eventIDNew, (int)$phpInput['facultyId'], (bool)$phpInput['isGlobal']);
        $event_faculty->storeInDB();

        // If all operations succeeded, commit the transaction
        $connection->commit();

        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        // Rollback the transaction on database error
        $connection->rollBack();
        echo json_encode([
            'success' => false,
            'message' => "Неуспешно свързване с базата данни",
        ]);
    } catch (Exception $e) {
        // Rollback the transaction on any other exception
        $connection->rollBack();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        // eventually will delete data
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>