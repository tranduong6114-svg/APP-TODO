<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn() => response()->json([
    'status' => 'ok',
    'message' => 'Todo App API is running',
]));

Route::get('/dashboard', [DashboardController::class, 'index']);
