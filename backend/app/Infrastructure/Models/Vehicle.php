<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $table = 'vehicles';
    public $timestamps = false;

    protected $fillable = [
        'person_id',
        'make',
        'model',
        'year',
        'price_per_day',
    ];

        public function person()
    {
        return $this->belongsTo(Person::class);
    }
}
