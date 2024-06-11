<?php
session_start();

if (!isset($_SESSION['username'])) {
    echo json_encode([
        'success' => false,
        'message' => "Няма логнат потребител!",
    ]);
    exit();
}

$filesDir = "../../files/upload_image/";

if (!is_dir($filesDir)) {
    mkdir($filesDir, 0777, true);
}

$uploaded_file = $filesDir . basename($_FILES['photo']['name']);

if (move_uploaded_file($_FILES['photo']['tmp_name'], $uploaded_file)) {
    echo json_encode([
        'success' => true,
        'message' => "Успешно качване на картичка!",
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => "Неуспешно качване на картичка!",
    ]);
}
?>
