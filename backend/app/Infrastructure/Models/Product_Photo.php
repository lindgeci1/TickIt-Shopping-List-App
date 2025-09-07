<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Product;

class Product_Photo extends Model
{
    protected $table = 'product_photos';
    protected $primaryKey = 'product_photo_id'; // lowercase
    protected $fillable = ['url', 'public_id', 'product_id']; // lowercase
    public $timestamps = false;

    // A photo belongs to a product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}
