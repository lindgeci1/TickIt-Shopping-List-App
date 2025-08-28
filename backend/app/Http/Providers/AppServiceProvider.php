<?php

namespace App\Http\Providers;

use Illuminate\Support\ServiceProvider;

// Repository Interfaces
use App\Domain\Interfaces\ProductRepositoryInterface;
use App\Domain\Interfaces\MarketRepositoryInterface;

// Repository Implementations
use App\Infrastructure\Repositories\EloquentProductRepository;
use App\Infrastructure\Repositories\EloquentMarketRepository;

// Service Interfaces
use App\Application\Interfaces\Product\GetAllProductsServiceInterface;
use App\Application\Interfaces\Product\GetProductServiceInterface;
use App\Application\Interfaces\Product\CreateProductServiceInterface;
use App\Application\Interfaces\Product\UpdateProductServiceInterface;
use App\Application\Interfaces\Product\DeleteProductServiceInterface;

use App\Application\Interfaces\Market\GetAllMarketsServiceInterface;
use App\Application\Interfaces\Market\GetMarketServiceInterface;
use App\Application\Interfaces\Market\CreateMarketServiceInterface;
use App\Application\Interfaces\Market\UpdateMarketServiceInterface;
use App\Application\Interfaces\Market\DeleteMarketServiceInterface;

use App\Application\Interfaces\ProductMarket\AssignMarketsToProductServiceInterface;

// Service Implementations
use App\Application\UseCases\Product\GetAllProductsUseCase;
use App\Application\UseCases\Product\GetProductUseCase;
use App\Application\UseCases\Product\CreateProductUseCase;
use App\Application\UseCases\Product\UpdateProductUseCase;
use App\Application\UseCases\Product\DeleteProductUseCase;

use App\Application\UseCases\Market\GetAllMarketsUseCase;
use App\Application\UseCases\Market\GetMarketUseCase;
use App\Application\UseCases\Market\CreateMarketUseCase;
use App\Application\UseCases\Market\UpdateMarketUseCase;
use App\Application\UseCases\Market\DeleteMarketUseCase;

use App\Application\UseCases\ProductMarket\AssignMarketsToProductService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repository bindings
        $this->app->bind(ProductRepositoryInterface::class, EloquentProductRepository::class);
        $this->app->bind(MarketRepositoryInterface::class, EloquentMarketRepository::class);

        // Product Services
        $this->app->bind(GetAllProductsServiceInterface::class, GetAllProductsUseCase::class);
        $this->app->bind(GetProductServiceInterface::class, GetProductUseCase::class);
        $this->app->bind(CreateProductServiceInterface::class, CreateProductUseCase::class);
        $this->app->bind(UpdateProductServiceInterface::class, UpdateProductUseCase::class);
        $this->app->bind(DeleteProductServiceInterface::class, DeleteProductUseCase::class);

        // Market Services
        $this->app->bind(GetAllMarketsServiceInterface::class, GetAllMarketsUseCase::class);
        $this->app->bind(GetMarketServiceInterface::class, GetMarketUseCase::class);
        $this->app->bind(CreateMarketServiceInterface::class, CreateMarketUseCase::class);
        $this->app->bind(UpdateMarketServiceInterface::class, UpdateMarketUseCase::class);
        $this->app->bind(DeleteMarketServiceInterface::class, DeleteMarketUseCase::class);

        // Product-Market Service
        $this->app->bind(AssignMarketsToProductServiceInterface::class, AssignMarketsToProductService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Leave empty if not needed
    }
}
