<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Shopping_List_Item_Product;
use App\Infrastructure\Models\Product_Market;

class Shopping_List_Item_Product_Market extends Model
{
    protected $table = 'shopping_list_item_product_market';
    protected $primaryKey = 'shopping_list_item_product_market_id';
    public $timestamps = false;

    protected $fillable = [
        'shopping_list_item_product_id', // changed
        'product_market_id',
        'selected_price', // add this
    ];

    public function shoppingListItemProduct()
    {
        return $this->belongsTo(
            Shopping_List_Item_Product::class, // changed
            'shopping_list_item_product_id', // changed
            'shopping_list_item_product_id'
        );
    }

    public function productMarket()
    {
        return $this->belongsTo(
            Product_Market::class,
            'product_market_id',
            'product_market_id'
        );
    }
}
