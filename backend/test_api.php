<?php

$endpoints = [
    '/api/shows',
    '/api/auditions',
    '/api/episodes',
    '/api/gallery',
    '/api/admin/dashboard',
    '/api/admin/applicants',
    '/api/admin/reports'
];

echo "=== TESTING BACKEND REST API ENDPOINTS ===\n";
foreach ($endpoints as $ep) {
    $url = 'http://127.0.0.1:8000' . $ep;
    $content = @file_get_contents($url);
    if ($content === false) {
        echo "[FAIL] $ep\n";
    } else {
        $json = json_decode($content, true);
        echo "[OK] $ep => " . ($json['success'] ? 'SUCCESS' : 'FAILED') . "\n";
    }
}
