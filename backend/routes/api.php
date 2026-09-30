<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ShowController;
use App\Http\Controllers\Api\AuditionController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\EpisodeController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\SettingController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/health', function() {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $userCount = \App\Models\User::count();
        return response()->json([
            'status' => 'ok',
            'db_connected' => true,
            'database_name' => \Illuminate\Support\Facades\DB::connection()->getDatabaseName(),
            'users_count' => $userCount
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'db_connected' => false,
            'message' => $e->getMessage()
        ], 500);
    }
});

Route::get('/shows', [ShowController::class, 'index']);
Route::get('/shows/{id}', [ShowController::class, 'show']);
Route::get('/shows/{id}/seats', [ShowController::class, 'seats']);

Route::get('/auditions', [AuditionController::class, 'index']);
Route::get('/auditions/{id}', [AuditionController::class, 'show']);
Route::post('/auditions/{id}/apply', [AuditionController::class, 'apply']);

Route::get('/episodes', [EpisodeController::class, 'index']);
Route::get('/episodes/{id}', [EpisodeController::class, 'show']);

Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/settings', [SettingController::class, 'index']);
Route::post('/contact', [UserController::class, 'submitContact']);

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

/*
|--------------------------------------------------------------------------
| Booking & User Dashboard Routes
|--------------------------------------------------------------------------
*/
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings/{id}', [BookingController::class, 'show']);

Route::middleware('auth:sanctum')->prefix('user')->group(function () {
    Route::get('/dashboard', [UserController::class, 'dashboard']);
    Route::get('/tickets', [UserController::class, 'tickets']);
    Route::get('/auditions', [UserController::class, 'auditions']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    
    // Applicants & Audition Schedules
    Route::get('/applicants', [AdminController::class, 'applicants']);
    Route::get('/applicants/{id}', [AdminController::class, 'applicantShow']);
    Route::patch('/applicants/{id}/status', [AdminController::class, 'updateApplicantStatus']);
    Route::post('/audition-schedules', [AdminController::class, 'scheduleAudition']);
    
    // Shows CRUD
    Route::get('/shows', [AdminController::class, 'shows']);
    Route::post('/shows', [AdminController::class, 'createShow']);
    Route::put('/shows/{id}', [AdminController::class, 'updateShow']);
    Route::delete('/shows/{id}', [AdminController::class, 'deleteShow']);
    
    // Bookings, Customers, Performers, Reports, Episodes, Gallery
    Route::get('/bookings', [AdminController::class, 'bookings']);
    Route::get('/customers', [AdminController::class, 'customers']);
    Route::get('/performers', [AdminController::class, 'performers']);
    Route::post('/performers', [AdminController::class, 'storePerformer']);
    Route::put('/performers/{id}', [AdminController::class, 'updatePerformer']);
    Route::delete('/performers/{id}', [AdminController::class, 'deletePerformer']);
    Route::get('/reports', [AdminController::class, 'reports']);

    // Episodes CMS
    Route::get('/episodes', [AdminController::class, 'episodes']);
    Route::post('/episodes', [AdminController::class, 'storeEpisode']);
    Route::put('/episodes/{id}', [AdminController::class, 'updateEpisode']);
    Route::delete('/episodes/{id}', [AdminController::class, 'deleteEpisode']);

    // Gallery CMS
    Route::get('/gallery', [AdminController::class, 'gallery']);
    Route::post('/gallery', [AdminController::class, 'storeGalleryImage']);
    Route::put('/gallery/{id}', [AdminController::class, 'updateGalleryImage']);
    Route::delete('/gallery/{id}', [AdminController::class, 'deleteGalleryImage']);

    // Settings & File Uploads
    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'update']);
    Route::post('/upload', [SettingController::class, 'upload']);
});

