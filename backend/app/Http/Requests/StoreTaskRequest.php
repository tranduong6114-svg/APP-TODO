<?php

namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        if (! $this->filled('category_id')) {
            return true;
        }

        return Category::where('id', $this->input('category_id'))
            ->where('user_id', Auth::id())
            ->exists();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'is_completed' => ['sometimes', 'boolean'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'deadline' => ['nullable', 'date', 'after_or_equal:yesterday'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Vui lòng nhập tiêu đề công việc',
            'title.max' => 'Tiêu đề không được vượt quá 255 ký tự',
            'category_id.exists' => 'Danh mục không tồn tại',
            'deadline.date' => 'Ngày hoàn thành không hợp lệ',
            'deadline.after_or_equal' => 'Ngày hoàn thành phải từ hôm nay trở đi',
        ];
    }
}
