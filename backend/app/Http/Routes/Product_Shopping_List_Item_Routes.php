<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Product_Shopping_List_Item_Controller;

Route::prefix('product-shopping-list-item')->group(function () {

    Route::post('/assign/{ProductID}', [Product_Shopping_List_Item_Controller::class, 'assign']);
    Route::delete('/remove/{ProductID}', [Product_Shopping_List_Item_Controller::class, 'remove']);
    Route::put('/update/{ProductID}', [Product_Shopping_List_Item_Controller::class, 'update']);
});
