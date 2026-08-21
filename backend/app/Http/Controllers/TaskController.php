<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $tasks = Task::with('category')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        $task = Task::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'category_id' => $validated['category_id'] ?? null,
            'deadline' => $validated['deadline'] ?? null,
        ]);

        $task->load('category');

        return (new TaskResource($task))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Bạn không có quyền sửa công việc này'], 403);
        }

        if ($task->is_completed) {
            return response()->json([
                'message' => 'Không thể sửa công việc đã hoàn thành',
                'errors' => ['general' => ['Công việc đã được đánh dấu hoàn thành, không thể sửa']]
            ], 422);
        }

        $task->update($request->validated());
        $task->load('category');

        return (new TaskResource($task))
            ->response()
            ->setStatusCode(200);
    } 

    public function destroy(Task $task): JsonResponse
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted'], 200);
    }
}
