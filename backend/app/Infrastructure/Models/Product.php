<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Market;
use App\Infrastructure\Models\Shopping_List_Item;

class Product extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'product_id'; // lowercase
    protected $fillable = ['name', 'description', 'price', 'is_favorite', 'category']; // lowercase
    public $timestamps = false;

    // A product can belong to many markets
    public function markets()
    {
        return $this->belongsToMany(
            Market::class,
            'product_market',   // pivot table
            'product_id',       // foreign key on pivot table for product
            'market_id'         // foreign key on pivot table for market
        );
    }

    // A product can belong to many shopping list items
    public function shoppingListItems()
    {
        return $this->belongsToMany(
            Shopping_List_Item::class,
            'shopping_list_item_product',   // pivot table
            'product_id',                   // foreign key on pivot table for product
            'shopping_list_item_id'         // foreign key on pivot table for shopping_list_item
        );
    }

        public function photo()
    {
        return $this->hasOne(Product_Photo::class, 'product_id', 'product_id');
    }
}
