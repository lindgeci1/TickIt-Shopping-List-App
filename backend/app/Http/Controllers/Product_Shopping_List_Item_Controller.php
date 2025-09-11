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
     *     path="/api/product-shopping-list-item/assign/{ProductID}",
     *     summary="Attach a product to selected shopping list items dynamically",
     *     tags={"Product_Shopping_List_Item"},
     *     @OA\Parameter(name="ProductID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Assign_Products_To_ShoppingListItem_DTO")),
     *     @OA\Response(response=201, description="Product successfully assigned to shopping list items", @OA\JsonContent(ref="#/components/schemas/Assign_Products_To_ShoppingListItem_DTO")),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function assign(Request $request, int $ProductID)
    {
        $shoppingListItemIds = $request->input('ShoppingListItemIDs', $request->input('shopping_list_item_ids', []));
        if (empty($shoppingListItemIds)) {
            return response()->json(['message' => 'No shopping list items selected'], 400);
        }

        $dto = new Assign_Products_To_ShoppingListItem_DTO($ProductID, $shoppingListItemIds);

        try {
            $this->assignUseCase->assign($dto);
            return response()->json(['success' => true]);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/product-shopping-list-item/remove/{ProductID}",
     *     summary="Detach a product from selected shopping list items dynamically",
     *     tags={"Product_Shopping_List_Item"},
     *     @OA\Parameter(name="ProductID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Assign_Products_To_ShoppingListItem_DTO")),
     *     @OA\Response(response=200, description="Product successfully removed from shopping list items"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function remove(Request $request, int $ProductID)
    {
        $shoppingListItemIds = $request->input('ShoppingListItemIDs', $request->input('shopping_list_item_ids', []));
        if (empty($shoppingListItemIds)) {
            return response()->json(['message' => 'No shopping list items selected'], 400);
        }

        $dto = new Assign_Products_To_ShoppingListItem_DTO($ProductID, $shoppingListItemIds);

        try {
            $this->removeUseCase->remove($dto);
            return response()->json(['success' => true]);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/product-shopping-list-item/update/{ProductID}",
     *     summary="Replace all shopping list items for a product with a new selection",
     *     tags={"Product_Shopping_List_Item"},
     *     @OA\Parameter(name="ProductID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Assign_Products_To_ShoppingListItem_DTO")),
     *     @OA\Response(response=200, description="Product shopping list items successfully updated"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function update(Request $request, int $ProductID)
    {
        $shoppingListItemIds = $request->input('ShoppingListItemIDs', $request->input('shopping_list_item_ids', []));
        if (empty($shoppingListItemIds)) {
            return response()->json(['message' => 'No shopping list items selected'], 400);
        }

        $dto = new Assign_Products_To_ShoppingListItem_DTO($ProductID, $shoppingListItemIds);

        try {
            $this->updateUseCase->update($dto);
            return response()->json(['success' => true]);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }
}
