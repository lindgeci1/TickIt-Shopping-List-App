<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use App\Infrastructure\Models\Vehicle;

class Person extends Model
{
    protected $table = 'people';

    // Set custom primary key
    protected $primaryKey = 'PersonID';

    protected $fillable = ['name', 'email', 'phone'];
    public $timestamps = false;

    // One Person has many Vehicles
    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'PersonID', 'PersonID');
    }
}
