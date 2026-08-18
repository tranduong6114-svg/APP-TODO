<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn() => response()->json([
    'status' => 'ok',
    'message' => 'Todo App API is running',
]));

Route::middleware('auth:web')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('tasks', TaskController::class);
});
