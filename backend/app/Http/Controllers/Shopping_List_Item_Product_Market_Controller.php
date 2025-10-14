<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Interfaces\Shopping_List_Item_Product_Market\I_Add_Product_To_Market_In_Shopping_List_Use_Case;
use App\Application\DTOs\Shopping_List_Item_Product_Market_DTO;
use InvalidArgumentException;

/**
 * @OA\Tag(
 *     name="Shopping_List_Item_Product_Market",
 *     description="Assign a market to a shopping list item product"
 * )
 */
class Shopping_List_Item_Product_Market_Controller extends Controller
{
    private I_Add_Product_To_Market_In_Shopping_List_Use_Case $assignMarketService;

    public function __construct(I_Add_Product_To_Market_In_Shopping_List_Use_Case $assignMarketService)
    {
        $this->assignMarketService = $assignMarketService;
    }

    /**
     * @OA\Post(
     *     path="/api/shopping-list-item-product-market/assign-market",
     *     summary="Assign a market for a product in a shopping list",
     *     tags={"Shopping_List_Item_Product_Market"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"shopping_list_item_id","product_id","market_id"},
     *             @OA\Property(property="shopping_list_item_id", type="integer"),
     *             @OA\Property(property="product_id", type="integer"),
     *             @OA\Property(property="market_id", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Market assigned", @OA\JsonContent(ref="#/components/schemas/Shopping_List_Item_Product_Market_DTO")),
     *     @OA\Response(response=400, description="Invalid input or assignment failed")
     * )
     */
    public function assignMarket(Request $request)
    {
        $shoppingListItemId = (int) $request->input('shopping_list_item_id');
        $productId = (int) $request->input('product_id');
        $marketId = (int) $request->input('market_id');

        try {
            $dto = $this->assignMarketService->assign($shoppingListItemId, $productId, $marketId);
            return response()->json($dto, 200);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }
}
