<?php

session_start();
session_unset();
session_destroy();
echo json_encode(['success' => true, 'message' => "Успешен изход от профила!"]);
