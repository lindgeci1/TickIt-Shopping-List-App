<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Market_Photo_Controller;

Route::prefix('market-photo')->group(function () {
    Route::post('/add', [Market_Photo_Controller::class, 'store']);
    Route::delete('/delete/{MarketID}', [Market_Photo_Controller::class, 'destroy']);
});
