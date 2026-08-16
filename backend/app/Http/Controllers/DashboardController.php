<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'message' => 'Welcome to Todo App API',
            'version' => '1.0.0',
            'endpoints' => [
                'auth' => '/api/auth',
                'categories' => '/api/categories',
                'tasks' => '/api/tasks',
            ],
        ]);
    }
}
