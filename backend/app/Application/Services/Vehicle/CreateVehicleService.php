<?php

namespace App\Application\Services\Vehicle;

use App\Domain\Entities\Vehicle;
use App\Infrastructure\Repositories\VehicleRepositoryInterface;
use App\Application\DTOs\VehicleDto;
use InvalidArgumentException;

class CreateVehicleService
{
    private VehicleRepositoryInterface $vehicleRepository;

    public function __construct(VehicleRepositoryInterface $vehicleRepository)
    {
        $this->vehicleRepository = $vehicleRepository;
    }

    // ── Create a new Vehicle ────────────────────────
    public function create(VehicleDto $dto): VehicleDto
    {
        // ── Basic validation ───────────────────────────
        if (empty(trim($dto->make))) {
            throw new InvalidArgumentException("Make is required.");
        }
        if (empty(trim($dto->modelName))) {
            throw new InvalidArgumentException("Model is required.");
        }
        if ($dto->year <= 0) {
            throw new InvalidArgumentException("Year must be a positive integer.");
        }
        if ($dto->pricePerDay <= 0) {
            throw new InvalidArgumentException("Price per day must be positive.");
        }
        if ($dto->PersonID <= 0) {
            throw new InvalidArgumentException("PersonID must be a valid integer.");
        }

        if (!$this->vehicleRepository->existsByPersonId($dto->PersonID)) {
            throw new InvalidArgumentException("Person with this PersonID does not exist.");
        }

        // ── Map DTO to Entity ─────────────────────────
        $vehicle = new Vehicle(
            $dto->VehicleID ?? null,
            $dto->make,
            $dto->modelName,
            $dto->year,
            $dto->pricePerDay,
            $dto->PersonID
        );

        // ── Save via repository ───────────────────────
        $this->vehicleRepository->create($vehicle);

        // ── Return DTO based on saved entity ─────────
        return new VehicleDto($vehicle);
    }
}
