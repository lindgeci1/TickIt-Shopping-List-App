<?php

namespace App\Infrastructure\Repositories;

use App\Domain\Entities\Shopping_List_Item_Product_Market;
use App\Infrastructure\Models\Shopping_List_Item_Product_Market as Shopping_List_Item_Product_MarketModel;
use App\Infrastructure\Models\Product_Market;
use App\Infrastructure\Models\Shopping_List_Item_Product;
use App\Domain\Interfaces\I_Shopping_List_Item_Product_Market_Repository;
use InvalidArgumentException;

class Eloquent_Shopping_List_Item_Product_Market_Repository implements I_Shopping_List_Item_Product_Market_Repository
{
    public function assignMarket(int $shoppingListItemProductId, int $productMarketId): ?Shopping_List_Item_Product_Market
    {
        // Fetch the shopping list item product to get its product_id
        $shoppingListItemProduct = Shopping_List_Item_Product::find($shoppingListItemProductId);

        if (!$shoppingListItemProduct) {
            throw new InvalidArgumentException("Shopping list product not found.");
        }

        // Fetch the product_market record
        $productMarket = Product_Market::find($productMarketId);

        if (!$productMarket) {
            throw new InvalidArgumentException("Product market not found.");
        }

        // Validate that product matches
        if ($shoppingListItemProduct->product_id !== $productMarket->product_id) {
            throw new InvalidArgumentException("The product selected does not exist on the selected list.");
        }

        // Create the new record in shopping_list_item_product_market
        $model = new Shopping_List_Item_Product_MarketModel();
        $model->shopping_list_item_product_id = $shoppingListItemProductId;
        $model->product_market_id = $productMarketId;
        $model->selected_price = $productMarket->price;
        $model->save();

        // Return the domain entity
        return new Shopping_List_Item_Product_Market(
            $model->shopping_list_item_product_market_id,
            $model->shopping_list_item_product_id,
            $model->product_market_id,
            $model->selected_price
        );
    }
}
