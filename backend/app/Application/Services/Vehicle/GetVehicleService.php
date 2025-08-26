<?php

namespace App\Application\Services\Vehicle;

use App\Application\DTOs\VehicleDto;
use App\Infrastructure\Repositories\VehicleRepositoryInterface;
use InvalidArgumentException;

class GetVehicleService
{
    private VehicleRepositoryInterface $vehicleRepository;

    public function __construct(VehicleRepositoryInterface $vehicleRepository)
    {
        $this->vehicleRepository = $vehicleRepository;
    }

    public function getById(int $VehicleID): VehicleDto
    {
        $vehicle = $this->vehicleRepository->findById($VehicleID);

        if (!$vehicle) {
            throw new InvalidArgumentException("Vehicle not found.");
        }

        return new VehicleDto($vehicle);
    }
}
