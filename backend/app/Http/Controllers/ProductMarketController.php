<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Interfaces\ProductMarket\AssignMarketsToProductServiceInterface;
use InvalidArgumentException;

/**
 * @OA\Tag(
 *     name="ProductMarket",
 *     description="API Endpoints for linking Products and Markets dynamically"
 * )
 */
class ProductMarketController extends Controller
{
    private AssignMarketsToProductServiceInterface $assignMarketsUseCase;

    public function __construct(AssignMarketsToProductServiceInterface $assignMarketsUseCase)
    {
        $this->assignMarketsUseCase = $assignMarketsUseCase;
    }

    /**
     * @OA\Post(
     *     path="/api/product-market/assign/{ProductID}",
     *     summary="Attach a product to selected markets dynamically",
     *     tags={"ProductMarket"},
     *     @OA\Parameter(
     *         name="ProductID",
     *         in="path",
     *         required=true,
     *         description="ID of the product to assign markets to",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="market_ids",
     *                 type="array",
     *                 @OA\Items(type="integer"),
     *                 description="Array of market IDs selected by the user"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product successfully assigned to markets",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product not found"
     *     )
     * )
     */
    public function assignMarkets(Request $request, int $ProductID)
    {
        $marketIds = $request->input('market_ids', []); // dynamic array of selected IDs
        if (empty($marketIds)) {
            return response()->json(['message' => 'No markets selected'], 400);
        }

        try {
            $this->assignMarketsUseCase->assign($ProductID, $marketIds);
            return response()->json(['success' => true]);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }
}
