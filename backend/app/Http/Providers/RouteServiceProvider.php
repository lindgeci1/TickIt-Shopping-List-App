<?php

namespace App\Http\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        
        $this->routes(function () {
            // Determine route path
            $routePath = env('APP_ROUTE_PATH') ?: app_path('Http/Routes');

            // Only load the file if it exists
            if (file_exists($routePath.'/api.php')) {
                Route::middleware('api')
                    ->prefix('api')
                    ->group($routePath.'/api.php');
            }

            if (file_exists($routePath.'/web.php')) {
                Route::middleware('web')
                    ->group($routePath.'/web.php');
            }
        });
    }
}
