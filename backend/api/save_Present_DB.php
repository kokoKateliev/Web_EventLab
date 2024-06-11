<?php

require_once "../db/DB.php";
require_once "../models/Present.php";

$phpInput = json_decode(file_get_contents('php://input'), true);
$EventID = $phpInput['eventId']; 
$title = $phpInput['title']; 
$price = $phpInput['price'];
$endDate = $phpInput['endDate'];  

$present = new Present(null, $title, $price, $endDate, $EventId)

try{
    $present->validate();
    $present->storeInDB();
    echo json_encode(['success' => true]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

