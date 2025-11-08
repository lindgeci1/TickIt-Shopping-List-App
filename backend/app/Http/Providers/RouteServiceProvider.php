<?php

namespace App\Http\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
       $this->routes(function () {
        $routePath = env('APP_ROUTE_PATH', app_path('Http/Routes'));

        Route::middleware('api')
            ->prefix('api')
            ->group($routePath.'/api.php');

        Route::middleware('web')
            ->group($routePath.'/web.php');
    });
    }
}
