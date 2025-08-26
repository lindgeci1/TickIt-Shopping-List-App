<?php

namespace App\Domain\Entities;

class Vehicle
{
    public ?int $VehicleID;
    public string $make;
    public string $modelName;
    public int $year;
    public float $pricePerDay;
    public int $PersonID;

    public ?Person $Person = null;

    public function __construct(?int $VehicleID, string $make, string $modelName, int $year, float $pricePerDay, int $PersonID)
    {
        $this->VehicleID = $VehicleID;
        $this->make = $make;
        $this->modelName = $modelName;
        $this->year = $year;
        $this->pricePerDay = $pricePerDay;
        $this->PersonID = $PersonID;
    }
}
