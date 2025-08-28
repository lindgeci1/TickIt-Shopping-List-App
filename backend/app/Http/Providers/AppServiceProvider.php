<?php

namespace App\Http\Providers;

use Illuminate\Support\ServiceProvider;
use App\Infrastructure\Repositories\PersonRepositoryInterface;
use App\Infrastructure\Repositories\EloquentPersonRepository;
use App\Infrastructure\Repositories\ProductRepositoryInterface;
use App\Infrastructure\Repositories\EloquentProductRepository;
use App\Infrastructure\Repositories\MarketRepositoryInterface;
use App\Infrastructure\Repositories\EloquentMarketRepository;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind repository interface to concrete implementation
        // $this->app->bind(PersonRepositoryInterface::class, EloquentPersonRepository::class);
        // $this->app->bind(VehicleRepositoryInterface::class, EloquentVehicleRepository::class);
        $this->app->bind(ProductRepositoryInterface::class, EloquentProductRepository::class);
        $this->app->bind(MarketRepositoryInterface::class, EloquentMarketRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // No database creation logic here if not needed
    }
}
