<?php
session_start();

if (!isset($_SESSION['username'])) {
    echo json_encode([
        'success' => false,
        'message' => "Няма логнат потребител!",
    ]);
    exit();
}

$filesDir = "../../files/upload_audio/";

if (!is_dir($filesDir)) {
    mkdir($filesDir, 0777, true);
}

if (isset($_FILES['musicURL']) && isset($_FILES['musicURL']['tmp_name'])) {
    $uploaded_file = $filesDir . basename($_FILES['musicURL']['name']);

    if (move_uploaded_file($_FILES['musicURL']['tmp_name'], $uploaded_file)) {
        echo json_encode([
            'success' => true,
            'message' => "Успешно качване на аудио файл!",
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => "Неуспешно качване на аудио файл!",
        ]);
    }
}
else {
    echo json_encode([
        'success' => false,
        'message' => "Файлът не е предоставен или е невалиден!",
    ]);
}
?>
