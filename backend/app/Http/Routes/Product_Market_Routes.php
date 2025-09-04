<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Product_Market_Controller;

Route::prefix('product-market')->group(function () {

    Route::post('/assign/{ProductID}', [Product_Market_Controller::class, 'assignMarkets']);
    Route::delete('/remove/{ProductID}', [Product_Market_Controller::class, 'removeMarkets']);
    Route::put('/update/{ProductID}', [Product_Market_Controller::class, 'updateMarkets']); // new route
});
