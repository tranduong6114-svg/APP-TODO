<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $categories = Category::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return CategoryResource::collection($categories);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::create([
            'user_id' => Auth::id(),
            'name' => $request->validated()['name'],
        ]);

        return (new CategoryResource($category))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        if ($category->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $category->update($request->validated());

        return new CategoryResource($category);
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted'], 200);
    }
}