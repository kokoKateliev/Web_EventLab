<?php

session_start();

require_once "../db/DB.php";

function getUserUniversityAndFaculty($connection) {
    $username = $_SESSION['username'];

    $sqlMyUniFac = "SELECT 
                un.id AS university_id,
                un.UniversityName AS university_name,
                f.id AS faculty_id,
                f.Facultyname AS faculty_name
            FROM 
                Users u
            JOIN 
                Universities un ON u.UniversityID = un.id
            LEFT JOIN 
                Faculties f ON u.FacultyID = f.id
            WHERE 
                u.username = ?";

    $query = $connection->prepare($sqlMyUniFac);
    $query->execute([$username]);

    $infoMyUniFac = [];
    $myUniversity = null;
    $myFaculty = null;
    while($row = $query->fetch(PDO::FETCH_ASSOC)){ 
        $myUniversity = [
            'id' => $row['university_id'], 
            'name' => $row['university_name']
        ];

        $myFaculty = [
            'id' => $row['faculty_id'], 
            'name' => $row['faculty_name']
        ];
    } 

    $sqlAllUniFac = "SELECT 
                un.id AS university_id,
                un.UniversityName AS university_name,
                f.id AS faculty_id,
                f.Facultyname AS faculty_name
            FROM 
                Universities un
            JOIN 
                universities_faculties uf ON un.id = uf.Uniid
            JOIN
                Faculties f ON uf.FacultyID = f.id";
            

    $queryAllUniFac = $connection->prepare($sqlAllUniFac);
    $queryAllUniFac->execute([]); 

    $infoAllUniFac = [];
    while($row1 = $queryAllUniFac->fetch(PDO::FETCH_ASSOC)){ 
        $university_id = $row1['university_id'];
    
        if (!isset($universities[$university_id])) {
            $universities[$university_id] = [
                'id' => $university_id,
                'name' => $row1['university_name'],
                'faculties' => []
            ];
        }
    
        if ($row1['faculty_id']) { 
            $universities[$university_id]['faculties'][] = [
                'id' => $row1['faculty_id'],
                'name' => $row1['faculty_name']
            ];
        }
    } 

    $universities = array_values($universities); 

    $information = [
        'universities' => $universities, 
        'myUniversity' => $myUniversity, 
        'myFaculty' => $myFaculty 
    ];
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

$information = getUserUniversityAndFaculty($connetction);

if(!$information){
    echo json_encode([
        'success' => false,
        'message' => "Няма намерени данни за всички университети, моя университет и факултет.",
        'data' => $information,
    ]);
} else {
    echo json_encode([
    'success' => true,
    'message' => "Намерени са данни за за всички университети, моя университет и факултет.",
    'data' => $information,
    ]);
}

?>