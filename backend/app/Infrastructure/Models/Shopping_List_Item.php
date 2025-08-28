<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Product;

class Shopping_List_Item extends Model
{
    protected $table = 'shopping_list_items';
    protected $primaryKey = 'shopping_list_item_id'; // lowercase
    protected $fillable = ['product_id', 'status', 'added_at', 'bought_at']; // lowercase
    public $timestamps = false;

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}
