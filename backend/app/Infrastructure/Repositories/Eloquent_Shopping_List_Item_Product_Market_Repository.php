<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Shopping_List_Item_Product_Market;
use App\Infrastructure\Models\Shopping_List_Item_Product_Market as Shopping_List_Item_Product_MarketModel;
use App\Infrastructure\Models\Product_Market;
use App\Infrastructure\Models\Shopping_List_Item;
use App\Infrastructure\Models\Product;
use App\Infrastructure\Models\Market;
use App\Domain\Interfaces\I_Shopping_List_Item_Product_Market_Repository;
use InvalidArgumentException;
use Illuminate\Database\Eloquent\Builder;
class Eloquent_Shopping_List_Item_Product_Market_Repository implements I_Shopping_List_Item_Product_Market_Repository
{
public function assignMarket(int $shoppingListItemId, int $productId, int $marketId): ?Shopping_List_Item_Product_Market
{
    // Fetch shopping list item
    $shoppingListItem = Shopping_List_Item::find($shoppingListItemId);
    if (!$shoppingListItem) {
        throw new InvalidArgumentException("Shopping list not found.");
    }

    // Fetch product
    $product = Product::find($productId);
    if (!$product) {
        throw new InvalidArgumentException("Product not found.");
    }

    // Fetch market
    $market = Market::find($marketId);
    if (!$market) {
        throw new InvalidArgumentException("Market not found.");
    }

    // Validate that the product is available in this market
    $productMarket = Product_Market::where('product_id', $productId)
        ->where('market_id', $marketId)
        ->first();

    if (!$productMarket) {
        throw new InvalidArgumentException("The selected market does not sell this product.");
    }

    // Validate that the product exists in the shopping list
    $shoppingListHasProduct = $shoppingListItem->products()
        ->where('shopping_list_item_product.product_id', $productId)
        ->exists();

    if (!$shoppingListHasProduct) {
        throw new InvalidArgumentException("The product selected does not exist in this shopping list.");
    }
// Check if this exact product-market pair already exists
$existsExact = Shopping_List_Item_Product_MarketModel::query()
    ->where('shopping_list_item_id', $shoppingListItemId)
    ->where('product_id', $productId)
    ->where('market_id', $marketId)
    ->exists();

if ($existsExact) {
    throw new InvalidArgumentException("This product is already assigned to the selected market in this shopping list.");
}

// Check if the same product is already assigned to *another* market in this shopping list
$existsOtherMarket = Shopping_List_Item_Product_MarketModel::query()
    ->where('shopping_list_item_id', $shoppingListItemId)
    ->where('product_id', $productId)
    ->where('market_id', '!=', $marketId)
    ->exists();

if ($existsOtherMarket) {
    throw new InvalidArgumentException("This product is already assigned to another market in this shopping list.");
}


    // Create the new record
    $model = new Shopping_List_Item_Product_MarketModel();
    $model->shopping_list_item_id = $shoppingListItemId;
    $model->product_id = $productId;
    $model->market_id = $marketId;
    $model->selected_price = $productMarket->final_price;
    $model->save();

    // Return the domain entity
    return new Shopping_List_Item_Product_Market(
        $model->shopping_list_item_product_market_id,
        $model->shopping_list_item_id,
        $model->product_id,
        $model->market_id,
        $model->selected_price
    );
}

}
