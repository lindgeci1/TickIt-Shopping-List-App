<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Interfaces\ShoppingList\I_GetAll_Shopping_List_Items_Use_Case;
use App\Application\Interfaces\ShoppingList\I_Create_Shopping_List_Item_Use_Case;
use App\Application\Interfaces\ShoppingList\I_Get_Shopping_List_Item_Use_Case;
use App\Application\Interfaces\ShoppingList\I_Update_Shopping_List_Item_Use_Case;
use App\Application\Interfaces\ShoppingList\I_Delete_Shopping_List_Item_Use_Case;
use App\Application\DTOs\Shopping_List_Item_DTO;
use InvalidArgumentException;

/**
 * @OA\Tag(
 *     name="ShoppingList",
 *     description="API Endpoints for Shopping List Items"
 * )
 */
class Shopping_List_Item_Controller extends Controller
{
    private I_GetAll_Shopping_List_Items_Use_Case $getAllService;
    private I_Create_Shopping_List_Item_Use_Case $createService;
    private I_Get_Shopping_List_Item_Use_Case $getService;
    private I_Update_Shopping_List_Item_Use_Case $updateService;
    private I_Delete_Shopping_List_Item_Use_Case $deleteService;

    public function __construct(
        I_GetAll_Shopping_List_Items_Use_Case $getAllService,
        I_Create_Shopping_List_Item_Use_Case $createService,
        I_Get_Shopping_List_Item_Use_Case $getService,
        I_Update_Shopping_List_Item_Use_Case $updateService,
        I_Delete_Shopping_List_Item_Use_Case $deleteService
    ) {
        $this->getAllService = $getAllService;
        $this->createService = $createService;
        $this->getService = $getService;
        $this->updateService = $updateService;
        $this->deleteService = $deleteService;
    }

    /**
     * @OA\Get(
     *     path="/api/shopping-list/all",
     *     summary="Get all shopping list items",
     *     tags={"ShoppingList"},
     *     @OA\Response(
     *         response=200,
     *         description="List of shopping list items",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Shopping_List_Item_DTO"))
     *     )
     * )
     */
    public function index()
    {
        return response()->json($this->getAllService->getAll());
    }

    /**
     * @OA\Get(
     *     path="/api/shopping-list/{Shopping_List_ItemID}",
     *     summary="Get a shopping list item by ID",
     *     tags={"ShoppingList"},
     *     @OA\Parameter(
     *         name="Shopping_List_ItemID",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Item found", @OA\JsonContent(ref="#/components/schemas/Shopping_List_Item_DTO")),
     *     @OA\Response(response=404, description="Item not found")
     * )
     */
    public function show(int $ShoppingListItemID)
    {
        try {
            $item = $this->getService->getById($ShoppingListItemID);
            return response()->json($item);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/shopping-list/create",
     *     summary="Create a new shopping list item",
     *     tags={"ShoppingList"},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Shopping_List_Item_DTO")),
     *     @OA\Response(response=201, description="Created item", @OA\JsonContent(ref="#/components/schemas/Shopping_List_Item_DTO")),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        try {
            $dto = new Shopping_List_Item_DTO(null);
            $dto->Name      = $request->input('Name');
            $dto->Status    = $request->input('Status');
            $dto->AddedAt   = $request->input('AddedAt');
            $dto->BoughtAt  = $request->input('BoughtAt');

            $created = $this->createService->create($dto);

            return response()->json($created, 201);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/shopping-list/update/{Shopping_List_ItemID}",
     *     summary="Update a shopping list item",
     *     tags={"ShoppingList"},
     *     @OA\Parameter(name="Shopping_List_ItemID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Shopping_List_Item_DTO")),
     *     @OA\Response(response=200, description="Updated item", @OA\JsonContent(ref="#/components/schemas/Shopping_List_Item_DTO")),
     *     @OA\Response(response=400, description="Validation error"),
     *     @OA\Response(response=404, description="Item not found")
     * )
     */
    public function update(Request $request, int $Shopping_List_ItemID)
    {
        try {
            $dto = new Shopping_List_Item_DTO(null);
            $dto->Shopping_List_ItemID = $Shopping_List_ItemID;
            $dto->Name      = $request->input('Name');
            $dto->Status    = $request->input('Status');
            $dto->AddedAt   = $request->input('AddedAt');
            $dto->BoughtAt  = $request->input('BoughtAt');

            $updated = $this->updateService->update($dto);

            return response()->json($updated, 200);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/shopping-list/delete/{Shopping_List_ItemID}",
     *     summary="Delete a shopping list item",
     *     tags={"ShoppingList"},
     *     @OA\Parameter(name="Shopping_List_ItemID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Item deleted", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"))),
     *     @OA\Response(response=404, description="Item not found"),
     *     @OA\Response(response=400, description="Deletion failed")
     * )
     */
    public function destroy(int $Shopping_List_ItemID)
    {
        try {
            $message = $this->deleteService->delete($Shopping_List_ItemID);
            return response()->json(['message' => $message], 200);
        } catch (\Exception $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }
}
