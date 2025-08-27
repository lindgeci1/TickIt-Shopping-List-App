<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Product;
use App\Infrastructure\Models\Market;

class ProductMarket extends Model
{
    protected $table = 'product_market';
    protected $primaryKey = 'ProductMarketID';
    protected $fillable = ['ProductID', 'MarketID'];
    public $timestamps = false;

    public function product()
    {
        return $this->belongsTo(Product::class, 'ProductID', 'ProductID');
    }

    public function market()
    {
        return $this->belongsTo(Market::class, 'MarketID', 'MarketID');
    }
}
