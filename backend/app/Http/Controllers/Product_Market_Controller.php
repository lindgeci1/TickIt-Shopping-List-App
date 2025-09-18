<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Application\Interfaces\ProductMarket\I_Assign_Markets_To_Product_Use_Case;
use App\Application\Interfaces\ProductMarket\I_Remove_Markets_From_Product_Use_Case;
use App\Application\Interfaces\ProductMarket\I_Get_Preferred_Market_Use_Case;
use InvalidArgumentException;
use App\Application\DTOs\Assign_Markets_To_Product_DTO;
use App\Application\DTOs\Remove_Markets_From_Product_DTO;
use App\Application\DTOs\Preferred_Market_DTO;
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
    private I_Get_Preferred_Market_Use_Case $getPreferredMarketUseCase;

    public function __construct(
        I_Assign_Markets_To_Product_Use_Case $assignMarketsUseCase,
        I_Remove_Markets_From_Product_Use_Case $removeMarketsUseCase,
        I_Get_Preferred_Market_Use_Case $getPreferredMarketUseCase
    ) {
        $this->assignMarketsUseCase = $assignMarketsUseCase;
        $this->removeMarketsUseCase = $removeMarketsUseCase;
        $this->getPreferredMarketUseCase = $getPreferredMarketUseCase;
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
        $markets = $request->input('Markets', $request->input('markets', []));
        if (empty($markets)) {
            return response()->json(['message' => 'No markets selected'], 400);
        }

        // Expecting $markets as array of ['MarketID' => int, 'Price' => float]
        $dto = new Assign_Markets_To_Product_DTO($ProductID, $markets);

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
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Remove_Markets_From_Product_DTO")),
     *     @OA\Response(response=200, description="Product successfully removed from markets"),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
        public function removeMarkets(Request $request, int $ProductID)
        {
            $marketIds = $request->input('MarketIDs', $request->input('marketIDs', []));

            if (empty($marketIds)) {
                return response()->json(['message' => 'No markets selected'], 400);
            }

            $dto = new Remove_Markets_From_Product_DTO($ProductID, $marketIds);

            try {
                $this->removeMarketsUseCase->remove($dto);
                return response()->json(['success' => true]);
            } catch (\Exception $ex) {
                return response()->json(['message' => $ex->getMessage()], 500);
            }
        }


/**
 * @OA\Get(
 *     path="/api/product-market/preferred/{ProductID}",
 *     summary="Get the market with the cheapest price for a product",
 *     tags={"Product_Market"},
 *     @OA\Parameter(
 *         name="ProductID",
 *         in="path",
 *         required=true,
 *         description="ID of the product to check",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Cheapest market found for the product",
 *         @OA\JsonContent(ref="#/components/schemas/Preferred_Market_DTO")
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Product not found or no markets assigned",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string")
 *         )
 *     )
 * )
 */
public function preferredMarket(int $ProductID)
{
    try {
        $dto = $this->getPreferredMarketUseCase->getPreferredMarket($ProductID);
        return response()->json($dto);
    } catch (\Exception $ex) {
        return response()->json(['message' => $ex->getMessage()], 404);
    }
}

}
