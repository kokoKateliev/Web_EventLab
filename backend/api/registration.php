<?php

$input = json_decode(file_get_contents('php://input'), true);
require_once "../models/User.php";

if ($input['role'] === 1){
    $user = new User(null, $input['username'], $input['firstname'], $input['lastname'], $input['password'], $input['email'], $input['role'],
                 $input['birthdate'], $input['university'], $input['faculty']);
} else {
    $user = new User(null, $input['username'], $input['firstname'], $input['lastname'], $input['password'], $input['email'], $input['role'],
                 $input['birthdate'], $input['university'], null);
}

try{
    $user->validate();
    $user->storeInDB();
    echo json_encode(['success' => true]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

