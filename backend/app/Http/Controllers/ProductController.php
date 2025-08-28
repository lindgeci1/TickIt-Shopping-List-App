<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Services\Product\GetAllProductsService;
use App\Application\Services\Product\CreateProductService;
use App\Application\Services\Product\GetProductService;
use App\Application\Services\Product\UpdateProductService;
use App\Application\Services\Product\DeleteProductService;

use App\Application\DTOs\ProductDto;
use InvalidArgumentException;

/**
 * @OA\Tag(
 *     name="Product",
 *     description="API Endpoints for Products"
 * )
 */
class ProductController extends Controller
{
    private GetAllProductsService $getAllProductsService;
    private CreateProductService $createProductService;
    private GetProductService $getProductService;
    private UpdateProductService $updateProductService;
    private DeleteProductService $deleteProductService;

        public function __construct(
            GetAllProductsService $getAllProductsService,
            CreateProductService $createProductService,
            GetProductService $getProductService,
            UpdateProductService $updateProductService,
            DeleteProductService $deleteProductService,
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
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/ProductDto"))
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
     *     @OA\Response(response=200, description="Product found", @OA\JsonContent(ref="#/components/schemas/ProductDto")),
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
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/ProductDto")),
     *     @OA\Response(response=201, description="Created product", @OA\JsonContent(ref="#/components/schemas/ProductDto"))
     * )
     */
    public function store(Request $request)
    {
        try {
            $dto = new ProductDto();
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
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/ProductDto")),
     *     @OA\Response(response=200, description="Updated product", @OA\JsonContent(ref="#/components/schemas/ProductDto")),
     *     @OA\Response(response=400, description="Validation error"),
     *     @OA\Response(response=404, description="Product not found")
     * )
     */
    public function update(Request $request, int $ProductID)
    {
        try {
            $dto = new ProductDto();
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
     *     @OA\Response(response=204, description="Product deleted"),
     *     @OA\Response(response=404, description="Product not found")
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
