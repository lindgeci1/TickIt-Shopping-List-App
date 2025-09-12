<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Interfaces\Shopping_List_Item_Product\I_Assign_Products_To_ShoppingListItem_Use_Case;
use App\Application\Interfaces\Shopping_List_Item_Product\I_Remove_ShoppingListItems_From_Product_Use_Case;
use App\Application\Interfaces\Shopping_List_Item_Product\I_Update_ShoppingListItems_For_Product_Use_Case;
use App\Application\DTOs\Assign_Products_To_ShoppingListItem_DTO;
use InvalidArgumentException;

/**
 * @OA\Tag(
 *     name="Product_Shopping_List_Item",
 *     description="API Endpoints for linking Products and Shopping List Items dynamically"
 * )
 */
class Product_Shopping_List_Item_Controller extends Controller
{
    private I_Assign_Products_To_ShoppingListItem_Use_Case $assignUseCase;
    private I_Remove_ShoppingListItems_From_Product_Use_Case $removeUseCase;
    private I_Update_ShoppingListItems_For_Product_Use_Case $updateUseCase;

    public function __construct(
        I_Assign_Products_To_ShoppingListItem_Use_Case $assignUseCase,
        I_Remove_ShoppingListItems_From_Product_Use_Case $removeUseCase,
        I_Update_ShoppingListItems_For_Product_Use_Case $updateUseCase
    ) {
        $this->assignUseCase = $assignUseCase;
        $this->removeUseCase = $removeUseCase;
        $this->updateUseCase = $updateUseCase;
    }

    /**
     * @OA\Post(
     *     path="/api/product-shopping-list-item/assign",
     *     summary="Attach multiple products to selected shopping list items dynamically",
     *     tags={"Product_Shopping_List_Item"},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Assign_Products_To_ShoppingListItem_DTO")),
     *     @OA\Response(response=201, description="Products successfully assigned to shopping list items"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function assign(Request $request)
    {
        $productIds = $request->input('ProductIDs', []);
        $shoppingListItemIds = $request->input('ShoppingListItemIDs', []);

        if (empty($productIds) || empty($shoppingListItemIds)) {
            return response()->json(['message' => 'ProductIDs and ShoppingListItemIDs are required'], 400);
        }

        $dto = new Assign_Products_To_ShoppingListItem_DTO($productIds, $shoppingListItemIds);

        try {
            $this->assignUseCase->assign($dto);
            return response()->json(['success' => true]);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/product-shopping-list-item/remove",
     *     summary="Detach multiple products from selected shopping list items dynamically",
     *     tags={"Product_Shopping_List_Item"},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Assign_Products_To_ShoppingListItem_DTO")),
     *     @OA\Response(response=200, description="Products successfully removed from shopping list items"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function remove(Request $request)
    {
        $productIds = $request->input('ProductIDs', []);
        $shoppingListItemIds = $request->input('ShoppingListItemIDs', []);

        if (empty($productIds) || empty($shoppingListItemIds)) {
            return response()->json(['message' => 'ProductIDs and ShoppingListItemIDs are required'], 400);
        }

        $dto = new Assign_Products_To_ShoppingListItem_DTO($productIds, $shoppingListItemIds);

        try {
            $this->removeUseCase->remove($dto);
            return response()->json(['success' => true]);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/product-shopping-list-item/update",
     *     summary="Replace all shopping list items for multiple products with a new selection",
     *     tags={"Product_Shopping_List_Item"},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Assign_Products_To_ShoppingListItem_DTO")),
     *     @OA\Response(response=200, description="Product shopping list items successfully updated"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function update(Request $request)
    {
        $productIds = $request->input('ProductIDs', []);
        $shoppingListItemIds = $request->input('ShoppingListItemIDs', []);

        if (empty($productIds) || empty($shoppingListItemIds)) {
            return response()->json(['message' => 'ProductIDs and ShoppingListItemIDs are required'], 400);
        }

        $dto = new Assign_Products_To_ShoppingListItem_DTO($productIds, $shoppingListItemIds);

        try {
            $this->updateUseCase->update($dto);
            return response()->json(['success' => true]);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }
}
