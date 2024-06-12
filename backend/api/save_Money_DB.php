<?php

require_once "../db/DB.php";
require_once "../models/Personalized.php";

try{
    $phpInput = json_decode(file_get_contents('php://input'), true);
    $amount = $phpInput['money']; 
    $personalized = new Personalized();

    $personalized->Amount = $amount;
    $personalized->EventID = $phpInput['eventId']; 

    $personalized->updateAmountInDB();
    echo json_encode(['success' => true]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

