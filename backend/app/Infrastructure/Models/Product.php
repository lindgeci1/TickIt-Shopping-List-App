<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Market;
use App\Infrastructure\Models\Shopping_List_Item;

class Product extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'product_id';
    protected $fillable = ['name', 'is_favorite', 'category', 'status']; // price removed

    public $timestamps = false;

    public function markets()
    {
        return $this->belongsToMany(
            Market::class,
            'product_market',
            'product_id',
            'market_id'
        );
    }

    public function shoppingListItems()
    {
        return $this->belongsToMany(
            Shopping_List_Item::class,
            'shopping_list_item_product',
            'product_id',
            'shopping_list_item_id'
        );
    }

    public function photo()
    {
        return $this->hasOne(Product_Photo::class, 'product_id', 'product_id');
    }
}
