<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Market_Controller;

Route::prefix('market')->group(function () {
    Route::get('/all', [Market_Controller::class, 'index']);
    Route::get('/all-only', [Market_Controller::class, 'getAllOnly']);
    Route::get('/{MarketID}', [Market_Controller::class, 'show']);
    Route::post('/create', [Market_Controller::class, 'store']);
    Route::put('/update/{MarketID}', [Market_Controller::class, 'update']);
    Route::delete('/delete/{MarketID}', [Market_Controller::class, 'destroy']);
});
