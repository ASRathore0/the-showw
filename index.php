<?php
/**
 * Root entry point for Hostinger deployment
 * Handles routing between React SPA frontend and Laravel API backend
 */

ini_set('display_errors', 1);
error_reporting(E_ALL);

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// 0. Verify Laravel Vendor dependencies exist
$vendorPath = __DIR__ . '/backend/vendor/autoload.php';
if (!file_exists($vendorPath)) {
    if (str_starts_with($uri, '/api')) {
        header('Content-Type: application/json', true, 500);
        echo json_encode([
            'status' => 'error',
            'error_type' => 'COMPOSER_VENDOR_MISSING',
            'message' => 'Composer vendor dependencies missing. Run "composer install" inside public_html/backend in Hostinger SSH.'
        ]);
        exit;
    }
}

// 1. Forward API requests to Laravel Backend
if (str_starts_with($uri, '/api')) {
    try {
        require_once __DIR__ . '/backend/public/index.php';
    } catch (\Throwable $e) {
        header('Content-Type: application/json', true, 500);
        echo json_encode([
            'status' => 'error',
            'error_type' => 'LARAVEL_FATAL_ERROR',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
    }
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
