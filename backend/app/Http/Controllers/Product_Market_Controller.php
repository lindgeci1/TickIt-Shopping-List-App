<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Interfaces\ProductMarket\I_Assign_Markets_To_Product_Use_Case;
use InvalidArgumentException;
use App\Application\DTOs\Assign_Markets_To_Product_DTO;
/**
 * @OA\Tag(
 *     name="ProductMarket",
 *     description="API Endpoints for linking Products and Markets dynamically"
 * )
 */
class Product_Market_Controller extends Controller
{
    private I_Assign_Markets_To_Product_Use_Case $assignMarketsUseCase;

    public function __construct(I_Assign_Markets_To_Product_Use_Case $assignMarketsUseCase)
    {
        $this->assignMarketsUseCase = $assignMarketsUseCase;
    }

    /**
     * @OA\Post(
     *     path="/api/product-market/assign/{ProductID}",
     *     summary="Attach a product to selected markets dynamically",
     *     tags={"ProductMarket"},
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
}
