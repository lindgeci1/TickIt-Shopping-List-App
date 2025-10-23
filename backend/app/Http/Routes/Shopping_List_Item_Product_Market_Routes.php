<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Shopping_List_Item_Product_Market_Controller;

Route::prefix('shopping-list-item-product-market')->group(function () {
    // Assign a market for a product in a shopping list
    Route::post('/assign-market', [Shopping_List_Item_Product_Market_Controller::class, 'assignProductToMarketShoppingListItem']);
    Route::delete('/{ProductID}/shopping-list/{ShoppingListItemID}/remove', [Shopping_List_Item_Product_Market_Controller::class, 'removeProductFromMarketShoppingListItem']);
});
