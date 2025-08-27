<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Market;
use App\Infrastructure\Models\ShoppingListItem;
use App\Infrastructure\Models\ProductMarket;

class Product extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'ProductID';
    protected $fillable = ['Name', 'Description', 'Price', 'IsFavorite', 'Category'];
    public $timestamps = false;

    // A product can belong to many markets
    public function markets()
    {
        return $this->belongsToMany(Market::class, ProductMarket::class, 'ProductID', 'MarketID');
    }

    // A product can have many shopping list items
    public function shoppingListItems()
    {
        return $this->hasMany(ShoppingListItem::class, 'ProductID', 'ProductID');
    }
}
