<?php

namespace App\Application\Services\Vehicle;

use App\Infrastructure\Repositories\VehicleRepositoryInterface;
use InvalidArgumentException;

class DeleteVehicleService
{
    private VehicleRepositoryInterface $vehicleRepository;

    public function __construct(VehicleRepositoryInterface $vehicleRepository)
    {
        $this->vehicleRepository = $vehicleRepository;
    }

    public function delete(int $VehicleID): string
    {
        $existing = $this->vehicleRepository->findById($VehicleID);
        if (!$existing) {
            throw new InvalidArgumentException("Vehicle not found.");
        }

        $deleted = $this->vehicleRepository->delete($VehicleID);

        if ($deleted) {
            return "Vehicle deleted successfully.";
        }

        throw new \RuntimeException("Failed to delete vehicle.");
    }
}
