<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Interfaces\Product\I_GetAll_Products_Use_Case;
use App\Application\Interfaces\Product\I_Create_Product_Use_Case;
use App\Application\Interfaces\Product\I_Get_Product_Use_Case;
use App\Application\Interfaces\Product\I_Update_Product_Use_Case;
use App\Application\Interfaces\Product\I_Delete_Product_Use_Case;
use App\Application\Interfaces\Product\I_Search_Product_Use_Case;
use App\Application\Interfaces\Product\I_Get_Favorite_Products_Use_Case;
use App\Application\Interfaces\Product\I_Get_Product_Markets_Use_Case;
use App\Application\DTOs\Product_DTO;
use App\Application\DTOs\Product_Markets_DTO;
use App\Application\Interfaces\Product\I_Get_Market_Photo_Price_Use_Case;
use App\Application\DTOs\Remove_Product_From_Shopping_List_DTO;
use App\Application\Interfaces\Product\I_Remove_Product_From_Shopping_List_Use_Case;
use App\Application\Interfaces\Product\I_Import_Products_From_Api_Use_Case;
use App\Application\Interfaces\Product\I_Get_Products_By_Category_Use_Case;
use App\Application\Interfaces\Product\I_Get_All_Categories_Use_Case;
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
    private I_Search_Product_Use_Case $searchProductService;
    private I_Get_Favorite_Products_Use_Case $getFavoriteProductsService;
    private I_Get_Product_Markets_Use_Case $getProductMarketsService;
    private I_Get_Market_Photo_Price_Use_Case $getMarketPhotoPriceService;
    private I_Remove_Product_From_Shopping_List_Use_Case $removeFromShoppingListService;
    private I_Import_Products_From_Api_Use_Case $importProductsService;
    private I_Get_Products_By_Category_Use_Case $getProductsByCategoryService;
    private I_Get_All_Categories_Use_Case $getAllCategoriesService;

    public function __construct(
        I_GetAll_Products_Use_Case $getAllProductsService,
        I_Create_Product_Use_Case $createProductService,
        I_Get_Product_Use_Case $getProductService,
        I_Update_Product_Use_Case $updateProductService,
        I_Delete_Product_Use_Case $deleteProductService,
        I_Search_Product_Use_Case $searchProductService,
        I_Get_Favorite_Products_Use_Case $getFavoriteProductsService,
        I_Get_Product_Markets_Use_Case $getProductMarketsService,
        I_Get_Market_Photo_Price_Use_Case $getMarketPhotoPriceService,
        I_Remove_Product_From_Shopping_List_Use_Case $removeFromShoppingListService,
        I_Import_Products_From_Api_Use_Case $importProductsService,
        I_Get_Products_By_Category_Use_Case $getProductsByCategoryService,
        I_Get_All_Categories_Use_Case $getAllCategoriesService
    ) {
        $this->getAllProductsService = $getAllProductsService;
        $this->createProductService = $createProductService;
        $this->getProductService = $getProductService;
        $this->updateProductService = $updateProductService;
        $this->deleteProductService = $deleteProductService;
        $this->searchProductService = $searchProductService;
        $this->getFavoriteProductsService = $getFavoriteProductsService;
        $this->getProductMarketsService = $getProductMarketsService;
        $this->getMarketPhotoPriceService = $getMarketPhotoPriceService;
        $this->removeFromShoppingListService = $removeFromShoppingListService;
        $this->importProductsService = $importProductsService;
        $this->getProductsByCategoryService = $getProductsByCategoryService;
        $this->getAllCategoriesService = $getAllCategoriesService;
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

    //  /**
    //  * @OA\Get(
    //  *     path="/api/product/search",
    //  *     summary="Search products by name",
    //  *     tags={"Product"},
    //  *     @OA\Parameter(
    //  *         name="name",
    //  *         in="query",
    //  *         required=true,
    //  *         @OA\Schema(type="string")
    //  *     ),
    //  *     @OA\Response(
    //  *         response=200,
    //  *         description="List of matching products",
    //  *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Product_DTO"))
    //  *     )
    //  * )
    //  */
    // public function search(Request $request)
    // {
    //     $name = $request->query('name', '');

    //     if (empty(trim($name))) {
    //         return response()->json([], 200);
    //     }

    //     $results = $this->searchProductService->searchByName($name);
    //     return response()->json($results, 200);
    // }

    /**
     * @OA\Get(
     *     path="/api/product/favorites",
     *     summary="Get all favorite products",
     *     tags={"Product"},
     *     @OA\Response(
     *         response=200,
     *         description="List of favorite products",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Product_DTO"))
     *     )
     * )
     */
    public function getFavorites()
    {
        $favorites = $this->getFavoriteProductsService->getFavorites();
        return response()->json($favorites, 200);
    }

    /**
 * @OA\Get(
 *     path="/api/product/{ProductID}/markets",
 *     summary="Get markets for a product with price and photo",
 *     tags={"Product"},
 *     @OA\Parameter(
 *         name="ProductID",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of markets with product price and photo",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Product_Markets_DTO")
 *         )
 *     ),
 *     @OA\Response(response=404, description="Product not found")
 * )
 */

    public function getMarkets(int $ProductID)
{
    try {
        $markets = $this->getProductMarketsService->execute($ProductID);
        return response()->json($markets, 200);
    } catch (InvalidArgumentException $ex) {
        return response()->json(['message' => $ex->getMessage()], 404);
    }
}

/**
 * @OA\Get(
 *     path="/api/product/{ProductID}/shopping-list/{ShoppingListItemID}/market-photo-price",
 *     summary="Get market photo and selected price for a product in a shopping list",
 *     tags={"Product"},
 *     @OA\Parameter(
 *         name="ProductID",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Parameter(
 *         name="ShoppingListItemID",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Market photo and selected price data",
 *         @OA\JsonContent(ref="#/components/schemas/Market_Photo_Price_DTO")
 *     ),
 *     @OA\Response(response=404, description="Data not found")
 * )
 */
public function getMarketPhotoAndSelectedPrice(int $ProductID, int $ShoppingListItemID)
{
    try {
        $result = $this->getMarketPhotoPriceService->getMarketPhotoAndSelectedPrice($ProductID, $ShoppingListItemID);

        if (!$result) {
            return response()->json(['message' => 'No market/photo/price data found'], 404);
        }

        return response()->json($result, 200);
    } catch (InvalidArgumentException $ex) {
        return response()->json(['message' => $ex->getMessage()], 400);
    } catch (\Exception $ex) {
        return response()->json(['message' => 'Unexpected error: ' . $ex->getMessage()], 500);
    }
}
    /**
     * @OA\Delete(
     *     path="/api/product/{ProductID}/shopping-list/{ShoppingListItemID}/remove",
     *     summary="Remove a product from a shopping list",
     *     tags={"Product"},
     *     @OA\Parameter(
     *         name="ProductID",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="ShoppingListItemID",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product removed from shopping list",
     *         @OA\JsonContent(type="object", @OA\Property(property="message", type="string"))
     *     ),
     *     @OA\Response(response=400, description="Failed to remove product")
     * )
     */
    public function removeFromShoppingList(int $ProductID, int $ShoppingListItemID)
    {
        try {
            $dto = new Remove_Product_From_Shopping_List_DTO([
                'ProductID' => $ProductID,
                'ShoppingListItemID' => $ShoppingListItemID,
            ]);

            $this->removeFromShoppingListService->execute($dto);

            return response()->json(['message' => 'Product removed from shopping list'], 200);
        } catch (\Exception $ex) {
            return response()->json(['message' => 'Failed to remove product: ' . $ex->getMessage()], 400);
        }
    }

        /**
     * @OA\Get(
     *     path="/api/product/category/{category}",
     *     summary="Get products by category",
     *     tags={"Product"},
     *     @OA\Parameter(
     *         name="category",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of products by category",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Product_DTO"))
     *     ),
     *     @OA\Response(response=404, description="No products found for this category")
     * )
     */
    public function getByCategory(string $category)
    {
        try {
            $products = $this->getProductsByCategoryService->getByCategory($category);

            if (empty($products)) {
                return response()->json(['message' => 'No products found for this category'], 404);
            }

            return response()->json($products, 200);
        } catch (\Exception $ex) {
            return response()->json(['message' => 'Failed to fetch products: ' . $ex->getMessage()], 400);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/product/categories",
     *     summary="Get all unique product categories",
     *     tags={"Product"},
     *     @OA\Response(
     *         response=200,
     *         description="List of all categories",
     *         @OA\JsonContent(type="array", @OA\Items(type="string"))
     *     ),
     *     @OA\Response(response=404, description="No categories found")
     * )
     */
    public function getAllCategories()
    {
        try {
            $categories = $this->getAllCategoriesService->getAll();

            if (empty($categories)) {
                return response()->json(['message' => 'No categories found'], 404);
            }

            return response()->json($categories, 200);
        } catch (\Exception $ex) {
            return response()->json(['message' => 'Failed to fetch categories: ' . $ex->getMessage()], 400);
        }
    }

        /**
     * @OA\Post(
     *     path="/api/product/import",
     *     summary="Import products from external API",
     *     tags={"Product"},
     *     @OA\Response(
     *         response=200,
     *         description="List of imported products",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Product_DTO"))
     *     )
     * )
     */
    public function importFromApi()
    {
        try {
            $importedProducts = $this->importProductsService->import(11); // default 11
            return response()->json($importedProducts, 200);
        } catch (\Exception $ex) {
            return response()->json(['message' => 'Failed to import products: ' . $ex->getMessage()], 400);
        }
    }

}
