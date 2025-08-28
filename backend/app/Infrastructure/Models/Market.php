<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Product;

class Market extends Model
{
    protected $table = 'markets';
    protected $primaryKey = 'market_id'; // lowercase
    protected $fillable = ['name', 'location']; // lowercase
    public $timestamps = false;

    // A market can have many products
    public function products()
    {
        return $this->belongsToMany(
            Product::class,
            'product_market',   // pivot table
            'market_id',        // foreign key on pivot table for market
            'product_id'        // foreign key on pivot table for product
        );
    }
}
