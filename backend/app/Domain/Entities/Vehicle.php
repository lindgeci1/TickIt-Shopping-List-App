<?php

namespace App\Domain\Entities;

class Vehicle
{
    public string $make;
    public string $model;
    public int $year;
    public float $pricePerDay;
    public int $person_id;

    public ?Person $owner = null;

    public function __construct(string $make, string $model, int $year, float $pricePerDay, int $person_id)
    {
        $this->make = $make;
        $this->model = $model;
        $this->year = $year;
        $this->pricePerDay = $pricePerDay;
        $this->person_id = $person_id;
    }
}
