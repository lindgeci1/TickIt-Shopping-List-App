<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Product;
use App\Infrastructure\Models\ProductMarket;

class Market extends Model
{
    protected $table = 'markets';
    protected $primaryKey = 'MarketID';
    protected $fillable = ['Name', 'Location'];
    public $timestamps = false;

    // A market can have many products
    public function products()
    {
        return $this->belongsToMany(Product::class, ProductMarket::class, 'MarketID', 'ProductID');
    }
}
