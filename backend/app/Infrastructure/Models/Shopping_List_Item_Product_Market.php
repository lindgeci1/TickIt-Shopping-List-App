<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Shopping_List_Item;
use App\Infrastructure\Models\Product;
use App\Infrastructure\Models\Market; // separate Market table

class Shopping_List_Item_Product_Market extends Model
{
    protected $table = 'shopping_list_item_product_market';
    protected $primaryKey = 'shopping_list_item_product_market_id';
    public $timestamps = false;

    protected $fillable = [
        'shopping_list_item_id',   // FK to Shopping_List_Item
        'product_id',              // FK to Product
        'market_id',               // FK to Market
        'selected_price',          // optional price
    ];

    // Relations
    public function shoppingListItem()
    {
        return $this->belongsTo(
            Shopping_List_Item::class,
            'shopping_list_item_id',
            'shopping_list_item_id'
        );
    }

    public function product()
    {
        return $this->belongsTo(
            Product::class,
            'product_id',
            'product_id'
        );
    }

    public function market()
    {
        return $this->belongsTo(
            Market::class,
            'market_id',
            'market_id'
        );
    }
}
