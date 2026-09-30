<?php

$content = @file_get_contents('http://localhost:5173');
if (strpos($content, 'id="root"') !== false) {
    echo "=== FRONTEND VITE SERVER IS LIVE AND SERVING APP HTML ===";
} else {
    echo "=== FRONTEND FAILED ===";
}
