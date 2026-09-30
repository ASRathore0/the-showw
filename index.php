<?php
/**
 * Root entry point for Hostinger deployment
 * Handles routing between React SPA frontend and Laravel API backend
 */

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// 1. If request is for API, load Laravel backend
if (str_starts_with($uri, '/api')) {
    require_once __DIR__ . '/backend/public/index.php';
    exit;
}

// 2. If request is for Laravel Storage files
if (str_starts_with($uri, '/storage/')) {
    $storagePath = __DIR__ . '/backend/storage/app/public/' . substr($uri, 9);
    if (file_exists($storagePath)) {
        $mime = mime_content_type($storagePath);
        header('Content-Type: ' . $mime);
        readfile($storagePath);
        exit;
    }
}

// 3. Serve Frontend static assets directly if requested file exists in dist
$distFilePath = __DIR__ . '/frontend/dist' . $uri;
if ($uri !== '/' && file_exists($distFilePath) && !is_dir($distFilePath)) {
    $mime = mime_content_type($distFilePath);
    if (str_ends_with($uri, '.css')) $mime = 'text/css';
    if (str_ends_with($uri, '.js')) $mime = 'application/javascript';
    if (str_ends_with($uri, '.svg')) $mime = 'image/svg+xml';
    
    header('Content-Type: ' . $mime);
    readfile($distFilePath);
    exit;
}

// 4. Default: Render React SPA index.html for all frontend page routes
$indexPath = __DIR__ . '/frontend/dist/index.html';
if (file_exists($indexPath)) {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($indexPath);
    exit;
}

echo "Site deployment in progress. Please refresh in a moment.";
