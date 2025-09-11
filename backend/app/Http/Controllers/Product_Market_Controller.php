<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Interfaces\ProductMarket\I_Assign_Markets_To_Product_Use_Case;
use App\Application\Interfaces\ProductMarket\I_Remove_Markets_From_Product_Use_Case;
use App\Application\Interfaces\ProductMarket\I_Update_Markets_For_Product_Use_Case;
use InvalidArgumentException;
use App\Application\DTOs\Assign_Markets_To_Product_DTO;
/**
 * @OA\Tag(
 *     name="Product_Market",
 *     description="API Endpoints for linking Products and Markets dynamically"
 * )
 */
class Product_Market_Controller extends Controller
{
    private I_Assign_Markets_To_Product_Use_Case $assignMarketsUseCase;
    private I_Remove_Markets_From_Product_Use_Case $removeMarketsUseCase;
    private I_Update_Markets_For_Product_Use_Case $updateMarketsUseCase;


    public function __construct(
        I_Assign_Markets_To_Product_Use_Case $assignMarketsUseCase,
        I_Remove_Markets_From_Product_Use_Case $removeMarketsUseCase,
        I_Update_Markets_For_Product_Use_Case $updateMarketsUseCase
    ) {
        $this->assignMarketsUseCase = $assignMarketsUseCase;
        $this->removeMarketsUseCase = $removeMarketsUseCase;
        $this->updateMarketsUseCase = $updateMarketsUseCase;
    }

    /**
     * @OA\Post(
     *     path="/api/product-market/assign/{ProductID}",
     *     summary="Attach a product to selected markets dynamically",
     *     tags={"Product_Market"},
     *     @OA\Parameter(name="ProductID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Assign_Markets_To_Product_DTO")),
     *     @OA\Response(response=201, description="Product successfully assigned to markets", @OA\JsonContent(ref="#/components/schemas/Assign_Markets_To_Product_DTO")),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */

    public function assignMarkets(Request $request, int $ProductID)
    {
        $marketIds = $request->input('MarketIDs', $request->input('market_ids', []));
        if (empty($marketIds)) {
            return response()->json(['message' => 'No markets selected'], 400);
        }

        $dto = new Assign_Markets_To_Product_DTO($ProductID, $marketIds);

        try {
            $this->assignMarketsUseCase->assign($dto);
            return response()->json(['success' => true]);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }

      /**
     * @OA\Delete(
     *     path="/api/product-market/remove/{ProductID}",
     *     summary="Detach a product from selected markets dynamically",
     *     tags={"Product_Market"},
     *     @OA\Parameter(name="ProductID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Assign_Markets_To_Product_DTO")),
     *     @OA\Response(response=200, description="Product successfully removed from markets"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function removeMarkets(Request $request, int $ProductID)
    {
        $marketIds = $request->input('MarketIDs', $request->input('market_ids', []));
        if (empty($marketIds)) {
            return response()->json(['message' => 'No markets selected'], 400);
        }

        $dto = new Assign_Markets_To_Product_DTO($ProductID, $marketIds);

        try {
            $this->removeMarketsUseCase->remove($dto);
            return response()->json(['success' => true]);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }

        /**
     * @OA\Put(
     *     path="/api/product-market/update/{ProductID}",
     *     summary="Replace all markets for a product with a new selection",
     *     tags={"Product_Market"},
     *     @OA\Parameter(name="ProductID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Assign_Markets_To_Product_DTO")),
     *     @OA\Response(response=200, description="Product markets successfully updated"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function updateMarkets(Request $request, int $ProductID)
    {
        $marketIds = $request->input('MarketIDs', $request->input('market_ids', []));
        if (empty($marketIds)) {
            return response()->json(['message' => 'No markets selected'], 400);
        }

        $dto = new Assign_Markets_To_Product_DTO($ProductID, $marketIds);

        try {
            $this->updateMarketsUseCase->update($dto);
            return response()->json(['success' => true]);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }
}
