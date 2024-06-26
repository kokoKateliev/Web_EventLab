<?php

session_start();

require_once "../db/DB.php";

function getIsLoggedUser($connection) {
    if (isset($_SESSION['username'])) {
        $username = $_SESSION['username'];
    } else {
        $username = null; 
    }

    if($username == null) {
        return false;
    }

    return true;
}

$phpInput = json_decode(file_get_contents('php://input'), true);

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

$information = getIsLoggedUser($connection);

if(!$information){
    echo json_encode([
        'success' => false,
        'message' => "Няма логнат потребител.",
        'isLogged' => $information,
    ]);
} else {
    echo json_encode([
        'success' => true,
        'message' => "Намерен е логнат потребител.",
        'isLogged' => $information,
    ]);
}


?>