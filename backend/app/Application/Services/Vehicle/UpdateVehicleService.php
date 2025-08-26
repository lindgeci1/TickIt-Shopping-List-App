<?php

namespace App\Application\Services\Vehicle;

use App\Domain\Entities\Vehicle;
use App\Infrastructure\Repositories\VehicleRepositoryInterface;
use App\Application\DTOs\VehicleDto;
use InvalidArgumentException;

class UpdateVehicleService
{
    private VehicleRepositoryInterface $vehicleRepository;

    public function __construct(VehicleRepositoryInterface $vehicleRepository)
    {
        $this->vehicleRepository = $vehicleRepository;
    }

    public function update(VehicleDto $dto): VehicleDto
    {
        if (!$dto->VehicleID) {
            throw new InvalidArgumentException("VehicleID is required for update.");
        }

        $existing = $this->vehicleRepository->findById($dto->VehicleID);
        if (!$existing) {
            throw new InvalidArgumentException("Vehicle not found.");
        }

        if (empty(trim($dto->make))) {
            throw new InvalidArgumentException("Vehicle make is required.");
        }

        if (empty(trim($dto->modelName))) {
            throw new InvalidArgumentException("Vehicle model is required.");
        }

        if (!$this->vehicleRepository->existsByPersonId($dto->PersonID)) {
            throw new InvalidArgumentException("Person with this PersonID does not exist.");
        }

        $vehicle = new Vehicle(
            $dto->VehicleID,
            $dto->make,
            $dto->modelName,
            $dto->year ?? null,
            $dto->pricePerDay ?? null,
            $dto->PersonID ?? null
        );

        $this->vehicleRepository->update($vehicle);

        return new VehicleDto($vehicle);
    }
}
