<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Product;

class ShoppingListItem extends Model
{
    protected $table = 'shopping_list_items';
    protected $primaryKey = 'ShoppingListItemID';
    protected $fillable = ['ProductID', 'Status', 'AddedAt', 'BoughtAt'];
    public $timestamps = false;

    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID', 'ProductID');
    }
}
