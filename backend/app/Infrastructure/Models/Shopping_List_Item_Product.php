<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Product;
use App\Infrastructure\Models\Shopping_List_Item;

class Shopping_List_Item_Product extends Model
{
    protected $table = 'shopping_list_item_product';
    protected $primaryKey = 'shopping_list_item_product_id';
    protected $fillable = ['shopping_list_item_id', 'product_id'];
    public $timestamps = false;

    // Relation to Product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    // Relation to Shopping List Item
    public function shoppingListItem()
    {
        return $this->belongsTo(Shopping_List_Item::class, 'shopping_list_item_id', 'shopping_list_item_id');
    }
}
