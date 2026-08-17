<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn() => response()->json([
    'status' => 'ok',
    'message' => 'Todo App API is running',
]));

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function () {
        return auth()->user();
    });
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('tasks', TaskController::class);
});