<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Product;

class Shopping_List_Item extends Model
{
    protected $table = 'shopping_list_items';
    protected $primaryKey = 'shopping_list_item_id';
    protected $fillable = ['name', 'added_at', 'bought_at']; // added 'name'
    public $timestamps = false;

    // A shopping list can contain many products through the pivot table
    public function products()
    {
        return $this->belongsToMany(
            Product::class,
            'shopping_list_item_product',   // pivot table
            'shopping_list_item_id',        // foreign key on pivot table for shopping_list_item
            'product_id'                    // foreign key on pivot table for product
        );
    }
}
