<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Vehicle;
use App\Infrastructure\Models\Vehicle as VehicleModel;

class EloquentVehicleRepository implements VehicleRepositoryInterface
{

    private PersonRepositoryInterface $personRepository;

    public function __construct(PersonRepositoryInterface $personRepository)
    {
        $this->personRepository = $personRepository;
    }
    public function findAll(): array
    {
        $models = VehicleModel::all();

        return $models->map(fn($m) => new Vehicle(
            $m->VehicleID,
            $m->make,
            $m->modelName, // updated property
            $m->year,
            $m->pricePerDay,
            $m->PersonID
        ))->all();
    }

    public function findById(int $VehicleID): ?Vehicle
    {
        $model = VehicleModel::find($VehicleID);
        if (!$model) return null;

        return new Vehicle(
            $model->VehicleID,
            $model->make,
            $model->modelName, // updated property
            $model->year,
            $model->pricePerDay,
            $model->PersonID
        );
    }

    public function create(Vehicle $vehicle): Vehicle
    {
        $model = new VehicleModel();
        $model->make       = $vehicle->make;
        $model->modelName  = $vehicle->modelName; // updated property
        $model->year       = $vehicle->year;
        $model->pricePerDay = $vehicle->pricePerDay;
        $model->PersonID   = $vehicle->PersonID;
        $model->save();

        return new Vehicle(
            $model->VehicleID,
            $model->make,
            $model->modelName, // updated property
            $model->year,
            $model->pricePerDay,
            $model->PersonID
        );
    }

    public function update(Vehicle $vehicle): bool
    {
        $model = VehicleModel::find($vehicle->VehicleID);
        if (!$model) return false;

        $model->make       = $vehicle->make;
        $model->modelName  = $vehicle->modelName; // updated property
        $model->year       = $vehicle->year;
        $model->pricePerDay = $vehicle->pricePerDay;
        $model->PersonID   = $vehicle->PersonID;

        return $model->save();
    }

    public function delete(int $VehicleID): bool
    {
        $model = VehicleModel::find($VehicleID);
        if (!$model) return false;

        return $model->delete();
    }

    public function existsByPersonId(int $PersonID): bool
    {
        // Use the PersonRepository to check if the person exists
        return $this->personRepository->findById($PersonID) !== null;
    }

}
