<?php

namespace App\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    // Specify the table name (optional, defaults to plural: "people")
    protected $table = 'people';

    // Columns that can be mass-assigned
    protected $fillable = ['name', 'email', 'phone'];

public $timestamps = false;
}
