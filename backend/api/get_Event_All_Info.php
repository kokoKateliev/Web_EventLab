<?php

require_once "../db/DB.php";

function getEventBasicInfo($connection, $EventID) {
    $sql = "SELECT
        e.id AS id,
        e.EventName AS title,
        e.EventDescription AS description,
        e.EventDateSt AS dateStart,
        e.EventDateEn AS dateEnd,
        e.EventTimeSt AS timeStart,
        e.EventTimeEn AS timeEnd,
        e.Location AS location,
        e.isAnonymous AS isAnonnymus,
        e.isPersonalized AS isPersonalized,
        ef.isGlobal AS isGlobal
    FROM Events e
    LEFT JOIN events_faculties ef ON e.id = ef.EventID
    WHERE e.id = ?";
    
    $query = $connection->prepare($sql);
    $query->execute([$EventID]);
    
    return $query->fetch(PDO::FETCH_ASSOC);
}

function getEventComments($connection, $EventID) {
    $sql = "SELECT
        c.CommentText AS text,
        c.CommentDate AS date,
        CONCAT(u.Firstname, ' ', u.Lastname) AS creatorFullName
    FROM Comments c
    INNER JOIN Users u ON c.UserID = u.id
    WHERE c.EventID = ?";
    
    $query = $connection->prepare($sql);
    $query->execute([$EventID]);
    
    return $query->fetchAll(PDO::FETCH_ASSOC);
}

function getEventPersonalizedData($connection, $EventID) {
    $sql = "SELECT
        p.isVisible,
        CONCAT(celebrator.Firstname, ' ', celebrator.Lastname) AS celebrator,
        p.Amount AS money
    FROM Personalized p
    INNER JOIN Users celebrator ON p.celebratorID = celebrator.id
    WHERE p.EventID = ?";
    
    $query = $connection->prepare($sql);
    $query->execute([$EventID]);
    
    $personalizedData = $query->fetch(PDO::FETCH_ASSOC);
    
    if ($personalizedData) {
        $sql = "SELECT
            pr.id,
            pr.Title AS title,
            pr.Price AS price,
            pr.EndDate AS endDate
        FROM Presents pr
        WHERE pr.EventID = ?";
        
        $query = $connection->prepare($sql);
        $query->execute([$EventID]);
        $personalizedData['presents'] = $query->fetchAll(PDO::FETCH_ASSOC);
        
        $sql = "SELECT
            card.id,
            card.imgURL AS imgUrl,
            card.description AS text
        FROM Cards card
        WHERE card.EventID = ?";
        
        $query = $connection->prepare($sql);
        $query->execute([$EventID]);
        $personalizedData['cards'] = $query->fetchAll(PDO::FETCH_ASSOC);
        
        $sql = "SELECT
            m.id,
            CONCAT(sender.Firstname, ' ', sender.Lastname) AS sender,
            m.title,
            m.musicURL
        FROM Music m
        INNER JOIN Users sender ON m.senderID = sender.id
        WHERE m.EventID = ?";
        
        $query = $connection->prepare($sql);
        $query->execute([$EventID]);
        $personalizedData['musics'] = $query->fetchAll(PDO::FETCH_ASSOC);
    }
    
    return $personalizedData;
}

function getEventAllInfo($connection, $EventID) {
    $eventInfo = getEventBasicInfo($connection, $EventID);
    
    if (!$eventInfo) {
        return null;
    }
    
    $eventInfo['comments'] = getEventComments($connection, $EventID);
    $eventInfo['personalizedData'] = getEventPersonalizedData($connection, $EventID);
    
    return $eventInfo;
}

$phpInput = json_decode(file_get_contents('php://input'), true);

$EventID = $phpInput['id'];  //eventID

try{
    $db = new DB();
    $connection = $db->getConnection();
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => "Неуспешно свързване с базата данни!",
        'userParticipants' => null,
    ]);
    exit();
}

$information = getEventAllInfo($connection, $EventID);

if(!$information){
    echo json_encode([
        'success' => false,
        'message' => "Няма намерени данни за събитие.",
        'data' => $information,
    ]);
} else {
    echo json_encode([
        'success' => true,
        'message' => "Намерени са данни за събитие.",
        'data' => $information,
    ]);
}
?>