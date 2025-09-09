<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Market;

class Market_Photo extends Model
{
    protected $table = 'market_photos';
    protected $primaryKey = 'market_photo_id'; // lowercase
    protected $fillable = ['url', 'public_id', 'market_id']; // lowercase
    public $timestamps = false;

    // A photo belongs to a market
    public function market()
    {
        return $this->belongsTo(Market::class, 'market_id', 'market_id');
    }
}
