<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Product_Controller;

Route::prefix('product')->group(function () {
    Route::get('/all', [Product_Controller::class, 'index']);
    Route::get('/search', [Product_Controller::class, 'search']);
    Route::get('/{ProductID}', [Product_Controller::class, 'show']);
    Route::post('/create', [Product_Controller::class, 'store']);
    Route::put('/update/{ProductID}', [Product_Controller::class, 'update']);
    Route::delete('/delete/{ProductID}', [Product_Controller::class, 'destroy']);
});

