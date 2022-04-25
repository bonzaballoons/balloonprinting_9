<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Menu;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function display($name, $categoryId)
    {
        $menu = Menu::getCategoriesWithURLAndImage(21);
        $category = Category::withProductURLAndImage($categoryId);

        $data['accessory_categories'] = $menu->categories;
        $data['category'] = $category;

        $data['title'] = $data['category']['name'].' '.$menu['name'].' - Balloon Printing UK';
        $data['meta_keywords'] = !empty( $category['meta_key'] ) ? $category['meta_key'] : $name.', '.$menu['name'];
        $data['meta_description'] = !empty( $category['meta_desc'] ) ? $category['meta_desc'] : $category['name'].' '.$menu['name'];

        return view('category/display', $data);
    }
}
