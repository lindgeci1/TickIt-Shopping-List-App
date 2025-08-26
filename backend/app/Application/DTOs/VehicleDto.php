<?php

namespace App\Application\DTOs;

use App\Domain\Entities\Vehicle;

/**
 * @OA\Schema(
 *     schema="VehicleDto",
 *     type="object",
 *     required={"make","modelName","year","pricePerDay","PersonID"},
 *     @OA\Property(property="VehicleID", type="integer", nullable=true),
 *     @OA\Property(property="make", type="string"),
 *     @OA\Property(property="modelName", type="string"),
 *     @OA\Property(property="year", type="integer"),
 *     @OA\Property(property="pricePerDay", type="number", format="float"),
 *     @OA\Property(property="PersonID", type="integer")
 * )
 */
class VehicleDto
{
    public ?int $VehicleID = null;
    public string $make;
    public string $modelName;
    public int $year;
    public float $pricePerDay;
    public int $PersonID;

    public function __construct(?Vehicle $vehicle = null)
    {
        if ($vehicle) {
            $this->VehicleID   = $vehicle->VehicleID;
            $this->make        = $vehicle->make;
            $this->modelName   = $vehicle->modelName;
            $this->year        = $vehicle->year;
            $this->pricePerDay = $vehicle->pricePerDay;
            $this->PersonID    = $vehicle->PersonID;
        }
    }
}
