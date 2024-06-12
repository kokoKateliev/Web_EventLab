<?php

require_once "../db/DB.php";
require_once "../models/Music.php";

try{
    $phpInput = json_decode(file_get_contents('php://input'), true);
    $id = $phpInput['musicId']; 

    $music = new Music();

    $music->id = $id;

    $music->deleteMusicInDB();

    echo json_encode(['success' => true]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

