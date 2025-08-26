<?php

namespace App\Application\Services\Vehicle;

use App\Domain\Entities\Vehicle;
use App\Infrastructure\Repositories\VehicleRepositoryInterface;
use App\Application\DTOs\VehicleDto;

class GetAllVehiclesService
{
    private VehicleRepositoryInterface $vehicleRepository;

    public function __construct(VehicleRepositoryInterface $vehicleRepository)
    {
        $this->vehicleRepository = $vehicleRepository;
    }

    // ── Get all Vehicles ──────────────────────────────
    public function getAll(): array
    {
        $all = $this->vehicleRepository->findAll(); // returns array of Vehicle entities

        // Map each entity to a DTO
        return array_map(fn(Vehicle $v) => new VehicleDto($v), $all);
    }
}
