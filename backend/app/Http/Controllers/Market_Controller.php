<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Interfaces\Market\I_Get_All_Markets_Use_Case;
use App\Application\Interfaces\Market\I_Create_Market_Use_Case;
use App\Application\Interfaces\Market\I_Get_Market_Use_Case;
use App\Application\Interfaces\Market\I_Update_Market_Use_Case;
use App\Application\Interfaces\Market\I_Delete_Market_Use_Case;
use App\Application\Interfaces\Market\I_Get_All_Markets_Only_Use_Case;
use App\Application\Interfaces\Market\I_Get_Preferred_Market_Use_Case;
use App\Application\DTOs\Market_DTO;
use App\Application\DTOs\Preferred_Market_DTO;
use InvalidArgumentException;

/**
 * @OA\Tag(
 *     name="Market",
 *     description="API Endpoints for Markets"
 * )
 */
class Market_Controller extends Controller
{
    private I_Get_All_Markets_Use_Case $getAllMarketsService;
    private I_Create_Market_Use_Case $createMarketService;
    private I_Get_Market_Use_Case $getMarketService;
    private I_Update_Market_Use_Case $updateMarketService;
    private I_Delete_Market_Use_Case $deleteMarketService;
    private I_Get_All_Markets_Only_Use_Case $getAllMarketsOnlyService;
    private I_Get_Preferred_Market_Use_Case $getPreferredMarketUseCase;

    public function __construct(
        I_Get_All_Markets_Use_Case $getAllMarketsService,
        I_Create_Market_Use_Case $createMarketService,
        I_Get_Market_Use_Case $getMarketService,
        I_Update_Market_Use_Case $updateMarketService,
        I_Delete_Market_Use_Case $deleteMarketService,
        I_Get_All_Markets_Only_Use_Case $getAllMarketsOnlyService,
        I_Get_Preferred_Market_Use_Case $getPreferredMarketUseCase
    ) {
        $this->getAllMarketsService = $getAllMarketsService;
        $this->createMarketService = $createMarketService;
        $this->getMarketService = $getMarketService;
        $this->updateMarketService = $updateMarketService;
        $this->deleteMarketService = $deleteMarketService;
        $this->getAllMarketsOnlyService = $getAllMarketsOnlyService;
        $this->getPreferredMarketUseCase = $getPreferredMarketUseCase;
    }

    /**
     * @OA\Get(
     *     path="/api/market/all",
     *     summary="Get all markets",
     *     tags={"Market"},
     *     @OA\Response(
     *         response=200,
     *         description="List of markets",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Market_DTO"))
     *     )
     * )
     */
    public function index()
    {
        return response()->json($this->getAllMarketsService->getAll());
    }

    /**
     * @OA\Get(
     *     path="/api/market/{MarketID}",
     *     summary="Get a market by MarketID",
     *     tags={"Market"},
     *     @OA\Parameter(
     *         name="MarketID",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Market found", @OA\JsonContent(ref="#/components/schemas/Market_DTO")),
     *     @OA\Response(response=404, description="Market not found")
     * )
     */
    public function show(int $MarketID)
    {
        try {
            $market = $this->getMarketService->getById($MarketID);
            return response()->json($market);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/market/create",
     *     summary="Create a new market",
     *     tags={"Market"},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Market_DTO")),
     *     @OA\Response(response=201, description="Created market", @OA\JsonContent(ref="#/components/schemas/Market_DTO")),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        try {
            $marketDto = new Market_DTO(null);
            $marketDto->Name     = $request->input('Name');
            $marketDto->Location = $request->input('Location');

            $createdMarket = $this->createMarketService->create($marketDto);

            return response()->json($createdMarket, 201);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/market/update/{MarketID}",
     *     summary="Update a market",
     *     tags={"Market"},
     *     @OA\Parameter(name="MarketID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Market_DTO")),
     *     @OA\Response(response=200, description="Updated market", @OA\JsonContent(ref="#/components/schemas/Market_DTO")),
     *     @OA\Response(response=400, description="Validation error"),
     *     @OA\Response(response=404, description="Market not found")
     * )
     */
    public function update(Request $request, int $MarketID)
    {
        try {
            $marketDto = new Market_DTO(null);
            $marketDto->MarketID = $MarketID;
            $marketDto->Name     = $request->input('Name');
            $marketDto->Location = $request->input('Location');

            $updatedMarket = $this->updateMarketService->update($marketDto);

            return response()->json($updatedMarket, 200);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/market/delete/{MarketID}",
     *     summary="Delete a market",
     *     tags={"Market"},
     *     @OA\Parameter(name="MarketID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Market deleted", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"))),
     *     @OA\Response(response=404, description="Market not found"),
     *     @OA\Response(response=400, description="Deletion failed")
     * )
     */
    public function destroy(int $MarketID)
    {
        try {
            $message = $this->deleteMarketService->delete($MarketID);
            return response()->json(['message' => $message], 200);
        } catch (\Exception $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }
    /**
     * @OA\Get(
     *     path="/api/market/all-only",
     *     summary="Get all markets (without linked products)",
     *     tags={"Market"},
     *     @OA\Response(
     *         response=200,
     *         description="List of markets only",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Market_DTO"))
     *     )
     * )
     */
    public function getAllOnly()
    {
        try {
            $markets = $this->getAllMarketsOnlyService->execute();
            return response()->json($markets, 200);
        } catch (\Exception $ex) {
            return response()->json(['message' => 'Failed to fetch markets: ' . $ex->getMessage()], 400);
        }
    }



/**
 * @OA\Get(
 *     path="/api/market/preferred/{ProductID}",
 *     summary="Get the market with the cheapest price for a product",
 *     tags={"Market"},
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
