<?php

use App\Http\Controllers\Product_Market_Controller;


Route::prefix('product-market')->group(function () {
    
    Route::post('/assign/{ProductID}', [Product_Market_Controller::class, 'assignMarkets']);
});
