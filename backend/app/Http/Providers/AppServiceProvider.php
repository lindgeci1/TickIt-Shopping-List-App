<?php

namespace App\Http\Providers;

use Illuminate\Support\ServiceProvider;
use App\Infrastructure\Repositories\PersonRepositoryInterface;
use App\Infrastructure\Repositories\EloquentPersonRepository;
use App\Infrastructure\Repositories\VehicleRepositoryInterface;
use App\Infrastructure\Repositories\EloquentVehicleRepository;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind repository interface to concrete implementation
        $this->app->bind(PersonRepositoryInterface::class, EloquentPersonRepository::class);
        $this->app->bind(VehicleRepositoryInterface::class, EloquentVehicleRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // No database creation logic here if not needed
    }
}
