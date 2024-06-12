<?php

require_once "../db/DB.php";
require_once "../models/Event.php";

function getUser($connection) {
    $sql = "
    SELECT 
        u.id,
        u.username,
        u.Firstname,
        u.Lastname,
        u.Email,
        r.Rolename AS rolename,
        u.Birthdate,
        un.UniversityName AS university,
        f.Facultyname AS faculty
    FROM 
        Users u
    JOIN 
        Roles r ON u.RoleID = r.id
    JOIN 
        Universities un ON u.UniversityID = un.id
    LEFT JOIN 
        Faculties f ON u.FacultyID = f.id";

    $query = $connetction->prepare($sql);
    $query->execute([]);

    $information = $query->fetch(PDO::FETCH_ASSOC);
    
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

$information = getUser($connetction);

if(!$information){
    echo json_encode([
        'success' => false,
        'message' => "Няма намерени данни за потребител.",
        'data' => $information,
    ]);
} else {
    echo json_encode([
    'success' => true,
    'message' => "Намерени са данни за потребител.",
    'data' => $information,
    ]);
}

?>