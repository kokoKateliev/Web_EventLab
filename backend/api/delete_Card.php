<?php

require_once "../db/DB.php";
require_once "../models/Card.php";

try{
    $phpInput = json_decode(file_get_contents('php://input'), true);
    $id = $phpInput['cardID']; 

    $card = new Card();

    $card->id = $id;

    $card->deleteCardInDB();

    echo json_encode(['success' => true]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

