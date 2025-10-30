<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Product;
use App\Infrastructure\Models\Market;

class Product_Market extends Model
{
    protected $table = 'product_market';
    protected $primaryKey = 'product_market_id';
    protected $fillable = ['product_id', 'market_id', 'price', 'discount', 'final_price']; // price added
    public $timestamps = false;

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    public function market()
    {
        return $this->belongsTo(Market::class, 'market_id', 'market_id');
    }
}
