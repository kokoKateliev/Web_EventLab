<?php

session_start();

require_once "../db/DB.php";

function getIsUserAdmin($connection) {
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

    $sqlIsAdmin = "SELECT
                       ue.isAdmin as Admin
                   FROM 
                       users_events ue
                   WHERE
                       ue.usersID = ?";

    $queryIsAdmin = $connection->prepare($sqlIsAdmin);
    $queryIsAdmin->execute([$loggedUserID]);
    
    $information = "";
    while($row1 = $queryIsAdmin->fetch(PDO::FETCH_ASSOC)){ 
        $information = (bool)$row1['Admin'];
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

$information = getIsUserAdmin($connetction);

if(!$information){
    echo json_encode([
        'success' => false,
        'message' => "Няма намерени данни за потребител админ.",
        'isUserAdmin' => $information,
    ]);
} else {
    echo json_encode([
        'success' => true,
        'message' => "Намерени са данни за потребител админ.",
        'isUserAdmin' => $information,
    ]);
}


?>