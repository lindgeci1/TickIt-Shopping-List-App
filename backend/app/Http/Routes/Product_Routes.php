<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Product_Controller;

Route::prefix('product')->group(function () {
    Route::get('/all', [Product_Controller::class, 'index']);
    Route::get('/search', [Product_Controller::class, 'search']);
    Route::get('/favorites', [Product_Controller::class, 'getFavorites']);
    Route::get('/{ProductID}', [Product_Controller::class, 'show']);
    Route::get('/{ProductID}/markets', [Product_Controller::class, 'getMarkets']);
    Route::get('/{ProductID}/shopping-list/{ShoppingListItemID}/market-photo-price', [Product_Controller::class, 'getMarketPhotoAndSelectedPrice']);
    Route::post('/create', [Product_Controller::class, 'store']);
    Route::put('/update/{ProductID}', [Product_Controller::class, 'update']);
    Route::delete('/delete/{ProductID}', [Product_Controller::class, 'destroy']);
    Route::delete('/{ProductID}/shopping-list/{ShoppingListItemID}/remove', [Product_Controller::class, 'removeFromShoppingList']);

    Route::post('/import', [Product_Controller::class, 'importFromApi']);
});
