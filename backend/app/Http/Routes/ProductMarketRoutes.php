<?php

use App\Http\Controllers\ProductMarketController;


Route::prefix('product-market')->group(function () {
    
    Route::post('/assign/{ProductID}', [ProductMarketController::class, 'assignMarkets']);
});
