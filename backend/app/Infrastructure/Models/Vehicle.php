<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Person;

class Vehicle extends Model
{
    protected $table = 'vehicles';
    protected $primaryKey = 'VehicleID';
    protected $fillable = ['make', 'modelName', 'year', 'pricePerDay', 'PersonID'];
    public $timestamps = false;

    public function person()
    {
        return $this->belongsTo(Person::class, 'PersonID', 'PersonID');
    }
}

