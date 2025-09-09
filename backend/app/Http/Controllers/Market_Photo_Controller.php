<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Interfaces\Market_Photo\I_Add_Market_Photo_Use_Case;
use App\Application\Interfaces\Market_Photo\I_Delete_Market_Photo_Use_Case;
use App\Application\DTOs\Market_Photo_DTO;
use InvalidArgumentException;

/**
 * @OA\Tag(
 *     name="Market_Photo",
 *     description="API Endpoints for Market Photos"
 * )
 */
class Market_Photo_Controller extends Controller
{
    private I_Add_Market_Photo_Use_Case $addPhotoService;
    private I_Delete_Market_Photo_Use_Case $deletePhotoService;

    public function __construct(
        I_Add_Market_Photo_Use_Case $addPhotoService,
        I_Delete_Market_Photo_Use_Case $deletePhotoService
    ) {
        $this->addPhotoService = $addPhotoService;
        $this->deletePhotoService = $deletePhotoService;
    }

    /**
     * @OA\Post(
     *     path="/api/market-photo/add",
     *     summary="Add a new market photo",
     *     tags={"Market_Photo"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/Market_Photo_DTO")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Added market photo",
     *         @OA\JsonContent(ref="#/components/schemas/Market_Photo_DTO")
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
            $photoDto = new Market_Photo_DTO();
            $photoDto->Url      = $request->input('Url');
            $photoDto->PublicID = $request->input('PublicID');
            $photoDto->MarketID = (int) $request->input('MarketID');

            $createdPhoto = $this->addPhotoService->add($photoDto);

            return response()->json($createdPhoto, 201);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/market-photo/delete/{MarketID}",
     *     summary="Delete a market photo by MarketID",
     *     tags={"Market_Photo"},
     *     @OA\Parameter(
     *         name="MarketID",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Photo deleted successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Deletion failed"
     *     )
     * )
     */
    public function destroy(int $MarketID)
    {
        try {
            $this->deletePhotoService->deleteByMarketId($MarketID);
            return response()->json(['message' => 'Photo deleted successfully'], 200);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }
}
