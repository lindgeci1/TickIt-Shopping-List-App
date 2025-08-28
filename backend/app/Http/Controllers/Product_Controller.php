<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Interfaces\Product\I_GetAll_Products_Use_Case;
use App\Application\Interfaces\Product\I_Create_Product_Use_Case;
use App\Application\Interfaces\Product\I_Get_Product_Use_Case;
use App\Application\Interfaces\Product\I_Update_Product_Use_Case;
use App\Application\Interfaces\Product\I_Delete_Product_Use_Case;
use App\Application\DTOs\Product_DTO;
use InvalidArgumentException;

/**
 * @OA\Tag(
 *     name="Product",
 *     description="API Endpoints for Products"
 * )
 */
class Product_Controller extends Controller
{
    private I_GetAll_Products_Use_Case $getAllProductsService;
    private I_Create_Product_Use_Case $createProductService;
    private I_Get_Product_Use_Case $getProductService;
    private I_Update_Product_Use_Case $updateProductService;
    private I_Delete_Product_Use_Case $deleteProductService;

    public function __construct(
        I_GetAll_Products_Use_Case $getAllProductsService,
        I_Create_Product_Use_Case $createProductService,
        I_Get_Product_Use_Case $getProductService,
        I_Update_Product_Use_Case $updateProductService,
        I_Delete_Product_Use_Case $deleteProductService
    ) {
        $this->getAllProductsService = $getAllProductsService;
        $this->createProductService = $createProductService;
        $this->getProductService = $getProductService;
        $this->updateProductService = $updateProductService;
        $this->deleteProductService = $deleteProductService;
    }

    /**
     * @OA\Get(
     *     path="/api/product/all",
     *     summary="Get all products",
     *     tags={"Product"},
     *     @OA\Response(
     *         response=200,
     *         description="List of products",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Product_DTO"))
     *     )
     * )
     */
    public function index()
    {
        return response()->json($this->getAllProductsService->getAll());
    }

    /**
     * @OA\Get(
     *     path="/api/product/{ProductID}",
     *     summary="Get a product by ProductID",
     *     tags={"Product"},
     *     @OA\Parameter(name="ProductID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Product found", @OA\JsonContent(ref="#/components/schemas/Product_DTO")),
     *     @OA\Response(response=404, description="Product not found")
     * )
     */
    public function show(int $ProductID)
    {
        try {
            $product = $this->getProductService->getById($ProductID);
            return response()->json($product);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/product/create",
     *     summary="Create a new product",
     *     tags={"Product"},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Product_DTO")),
     *     @OA\Response(response=201, description="Created product", @OA\JsonContent(ref="#/components/schemas/Product_DTO")),
     *     @OA\Response(response=400, description="Validation error")
     * )
     */
    public function store(Request $request)
    {
        try {
            $dto = new Product_DTO();
            $dto->Name = $request->input('Name');
            $dto->Description = $request->input('Description');
            $dto->Price = $request->input('Price');
            $dto->IsFavorite = $request->input('IsFavorite') ?? false;
            $dto->Category = $request->input('Category');

            $created = $this->createProductService->create($dto);

            return response()->json($created, 201);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/product/update/{ProductID}",
     *     summary="Update a product",
     *     tags={"Product"},
     *     @OA\Parameter(name="ProductID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Product_DTO")),
     *     @OA\Response(response=200, description="Updated product", @OA\JsonContent(ref="#/components/schemas/Product_DTO")),
     *     @OA\Response(response=400, description="Validation error"),
     *     @OA\Response(response=404, description="Product not found")
     * )
     */
    public function update(Request $request, int $ProductID)
    {
        try {
            $dto = new Product_DTO();
            $dto->ProductID = $ProductID;
            $dto->Name = $request->input('Name');
            $dto->Description = $request->input('Description');
            $dto->Price = $request->input('Price');
            $dto->IsFavorite = $request->input('IsFavorite') ?? false;
            $dto->Category = $request->input('Category');

            $updated = $this->updateProductService->update($dto);

            return response()->json($updated, 200);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/product/delete/{ProductID}",
     *     summary="Delete a product",
     *     tags={"Product"},
     *     @OA\Parameter(name="ProductID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Product deleted", @OA\JsonContent(type="object", @OA\Property(property="message", type="string"))),
     *     @OA\Response(response=404, description="Product not found"),
     *     @OA\Response(response=400, description="Deletion failed")
     * )
     */
    public function destroy(int $ProductID)
    {
        try {
            $message = $this->deleteProductService->delete($ProductID);
            return response()->json(['message' => $message], 200);
        } catch (\Exception $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }
}
