<?php
/**
 * Root entry point for Hostinger deployment
 * Handles routing between React SPA frontend and Laravel API backend
 */

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// 1. Forward API requests to Laravel Backend
if (str_starts_with($uri, '/api')) {
    require_once __DIR__ . '/backend/public/index.php';
    exit;
}

// 2. Forward storage uploaded files
if (str_starts_with($uri, '/storage/')) {
    $storagePath = __DIR__ . '/backend/storage/app/public/' . substr($uri, 9);
    if (file_exists($storagePath) && !is_dir($storagePath)) {
        header('Content-Type: ' . get_custom_mime($storagePath));
        readfile($storagePath);
        exit;
    }
}

// 3. Serve static assets if requested file exists in dist
$distFilePath = __DIR__ . '/frontend/dist' . $uri;
if ($uri !== '/' && file_exists($distFilePath) && !is_dir($distFilePath)) {
    header('Content-Type: ' . get_custom_mime($distFilePath));
    readfile($distFilePath);
    exit;
}

// 4. Default: Serve React SPA index.html for all page routes
$indexPath = __DIR__ . '/frontend/dist/index.html';
if (file_exists($indexPath)) {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($indexPath);
    exit;
}

echo "Site deployment in progress. Please refresh in a moment.";

function get_custom_mime($filepath) {
    $ext = strtolower(pathinfo($filepath, PATHINFO_EXTENSION));
    $mimes = [
        'css'  => 'text/css',
        'js'   => 'application/javascript',
        'svg'  => 'image/svg+xml',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif'  => 'image/gif',
        'webp' => 'image/webp',
        'ico'  => 'image/x-icon',
        'json' => 'application/json',
        'woff' => 'font/woff',
        'woff2'=> 'font/woff2',
        'ttf'  => 'font/ttf',
    ];
    return $mimes[$ext] ?? 'application/octet-stream';
}
