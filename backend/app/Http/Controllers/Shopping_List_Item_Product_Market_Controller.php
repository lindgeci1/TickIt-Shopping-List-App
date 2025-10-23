<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Interfaces\Shopping_List_Item_Product_Market\I_Add_Product_To_Market_In_Shopping_List_Use_Case;
use App\Application\Interfaces\Shopping_List_Item_Product_Market\I_Remove_Product_From_Market_Shopping_List_Use_Case;
use App\Application\DTOs\Assign_Product_To_Market_Shopping_List_Item_DTO;
use App\Application\DTOs\Remove_Product_From_Market_Shopping_List_Item_DTO;
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
    private I_Remove_Product_From_Market_Shopping_List_Use_Case $removeMarketService;

    public function __construct(I_Add_Product_To_Market_In_Shopping_List_Use_Case $assignMarketService, I_Remove_Product_From_Market_Shopping_List_Use_Case $removeMarketService)
    {
        $this->assignMarketService = $assignMarketService;
        $this->removeMarketService = $removeMarketService;
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
     *     @OA\Response(response=200, description="Market assigned", @OA\JsonContent(ref="#/components/schemas/Assign_Product_To_Market_Shopping_List_Item_DTO")),
     *     @OA\Response(response=400, description="Invalid input or assignment failed")
     * )
     */
    public function assignProductToMarketShoppingListItem(Request $request)
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

        /**
     * @OA\Delete(
     *     path="/api/product/{ProductID}/shopping-list/{ShoppingListItemID}/remove",
     *     summary="Remove a product from a shopping list",
     *     tags={"Product"},
     *     @OA\Parameter(
     *         name="ProductID",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="ShoppingListItemID",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product removed from shopping list",
     *         @OA\JsonContent(type="object", @OA\Property(property="message", type="string"))
     *     ),
     *     @OA\Response(response=400, description="Failed to remove product")
     * )
     */
    public function removeProductFromMarketShoppingListItem(int $ProductID, int $ShoppingListItemID)
    {
        try {
            $dto = new Remove_Product_From_Market_Shopping_List_Item_DTO([
                'ProductID' => $ProductID,
                'ShoppingListItemID' => $ShoppingListItemID,
            ]);

            $this->removeMarketService->execute($dto);

            return response()->json(['message' => 'Product removed from shopping list'], 200);
        } catch (\Exception $ex) {
            return response()->json(['message' => 'Failed to remove product: ' . $ex->getMessage()], 400);
        }
    }
}
