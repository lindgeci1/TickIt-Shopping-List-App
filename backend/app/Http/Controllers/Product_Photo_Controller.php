<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Interfaces\Product_Photo\I_Add_Product_Photo_Use_Case;
use App\Application\DTOs\Product_Photo_DTO;
use InvalidArgumentException;

/**
 * @OA\Tag(
 *     name="Product_Photo",
 *     description="API Endpoints for Product Photos"
 * )
 */
class Product_Photo_Controller extends Controller
{
    private I_Add_Product_Photo_Use_Case $addPhotoService;

    public function __construct(I_Add_Product_Photo_Use_Case $addPhotoService)
    {
        $this->addPhotoService = $addPhotoService;
    }

    /**
     * @OA\Post(
     *     path="/api/product-photo/add",
     *     summary="Add a new product photo",
     *     tags={"Product_Photo"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/Product_Photo_DTO")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Added product photo",
     *         @OA\JsonContent(ref="#/components/schemas/Product_Photo_DTO")
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
            $photoDto = new Product_Photo_DTO();
            $photoDto->Url       = $request->input('Url');
            $photoDto->PublicID  = $request->input('PublicID');
            $photoDto->ProductID = (int) $request->input('ProductID');

            $createdPhoto = $this->addPhotoService->add($photoDto);

            return response()->json($createdPhoto, 201);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }
}
