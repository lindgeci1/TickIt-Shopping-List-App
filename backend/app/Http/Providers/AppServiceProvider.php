<?php

namespace App\Http\Providers;

use Illuminate\Support\ServiceProvider;

// Repository Interfaces
use App\Domain\Interfaces\I_Product_Repository;
use App\Domain\Interfaces\I_Market_Repository;
use App\Domain\Interfaces\I_Shopping_List_Item_Repository;
use App\Domain\Interfaces\I_Product_Photo_Repository;
use App\Domain\Interfaces\I_Market_Photo_Repository;
use App\Domain\Interfaces\I_Shopping_List_Item_Product_Market_Repository;



// Repository Implementations
use App\Infrastructure\Repositories\Eloquent_Product_Repository;
use App\Infrastructure\Repositories\Eloquent_Market_Repository;
use App\Infrastructure\Repositories\Eloquent_Shopping_List_Item_Repository;
use App\Infrastructure\Repositories\Eloquent_Product_Photo_Repository;
use App\Infrastructure\Repositories\Eloquent_Market_Photo_Repository;
use App\Infrastructure\Repositories\Eloquent_Shopping_List_Item_Product_Market_Repository;

// Service Interfaces
use App\Application\Interfaces\Product\I_GetAll_Products_Use_Case;
use App\Application\Interfaces\Product\I_Get_Product_Use_Case;
use App\Application\Interfaces\Product\I_Create_Product_Use_Case;
use App\Application\Interfaces\Product\I_Update_Product_Use_Case;
use App\Application\Interfaces\Product\I_Delete_Product_Use_Case;
use App\Application\Interfaces\Product\I_Search_Product_Use_Case;
use App\Application\Interfaces\Product\I_Get_Favorite_Products_Use_Case;
use App\Application\Interfaces\Product\I_Get_Product_Markets_Use_Case;
use App\Application\Interfaces\Product\I_Get_Market_Photo_Price_Use_Case;

use App\Application\Interfaces\Market\I_GetAll_Markets_Use_Case;
use App\Application\Interfaces\Market\I_Get_Market_UseCase;
use App\Application\Interfaces\Market\I_Create_Market_Use_Case;
use App\Application\Interfaces\Market\I_Update_Market_Use_Case;
use App\Application\Interfaces\Market\I_Delete_Market_Use_Case;

use App\Application\Interfaces\ShoppingList\I_GetAll_Shopping_List_Items_Use_Case;
use App\Application\Interfaces\ShoppingList\I_Get_Shopping_List_Item_Use_Case;
use App\Application\Interfaces\ShoppingList\I_Create_Shopping_List_Item_Use_Case;
use App\Application\Interfaces\ShoppingList\I_Update_Shopping_List_Item_Use_Case;
use App\Application\Interfaces\ShoppingList\I_Delete_Shopping_List_Item_Use_Case;

use App\Application\Interfaces\ProductMarket\I_Assign_Markets_To_Product_Use_Case;
use App\Application\Interfaces\ProductMarket\I_Remove_Markets_From_Product_Use_Case;
use App\Application\Interfaces\ProductMarket\I_Get_Preferred_Market_Use_Case;

use App\Application\Interfaces\Product_Photo\I_Add_Product_Photo_Use_Case;
use App\Application\Interfaces\Product_Photo\I_Delete_Product_Photo_Use_Case;

use App\Application\Interfaces\Market_Photo\I_Add_Market_Photo_Use_Case;
use App\Application\Interfaces\Market_Photo\I_Delete_Market_Photo_Use_Case;

use App\Application\Interfaces\Shopping_List_Item_Product\I_Assign_Products_To_ShoppingListItem_Use_Case;
use App\Application\Interfaces\Shopping_List_Item_Product\I_Remove_ShoppingListItems_From_Product_Use_Case;
use App\Application\Interfaces\Shopping_List_Item_Product\I_Update_ShoppingListItems_For_Product_Use_Case;

use App\Application\Interfaces\Shopping_List_Item_Product_Market\I_Add_Product_To_Market_In_Shopping_List_Use_Case;


// Service Implementations
use App\Application\UseCases\Product\GetAll_Products_Use_Case;
use App\Application\UseCases\Product\Get_Product_Use_Case;
use App\Application\UseCases\Product\Create_Product_Use_Case;
use App\Application\UseCases\Product\Update_Product_Use_Case;
use App\Application\UseCases\Product\Delete_Product_Use_Case;
use App\Application\UseCases\Product\Search_Product_Use_Case;
use App\Application\UseCases\Product\Get_Favorite_Products_Use_Case;
use App\Application\UseCases\Product\Get_Product_Markets_Use_Case;
use App\Application\UseCases\Product\Get_Market_Photo_Price_Use_Case;


use App\Application\UseCases\Market\GetAll_Markets_Use_Case;
use App\Application\UseCases\Market\Get_Market_Use_Case;
use App\Application\UseCases\Market\Create_Market_Use_Case;
use App\Application\UseCases\Market\Update_Market_Use_Case;
use App\Application\UseCases\Market\Delete_Market_Use_Case;

use App\Application\UseCases\ShoppingList\GetAll_Shopping_List_Items_Use_Case;
use App\Application\UseCases\ShoppingList\Get_Shopping_List_Item_Use_Case;
use App\Application\UseCases\ShoppingList\Create_Shopping_List_Item_Use_Case;
use App\Application\UseCases\ShoppingList\Update_Shopping_List_Item_Use_Case;
use App\Application\UseCases\ShoppingList\Delete_Shopping_List_Item_Use_Case;

use App\Application\UseCases\ProductMarket\Assign_Markets_To_Product_Use_Case;
use App\Application\UseCases\ProductMarket\Remove_Markets_From_Product_Use_Case;
use App\Application\UseCases\ProductMarket\Get_Preferred_Market_Use_Case;

use App\Application\UseCases\Product_Photo\Add_Product_Photo_Use_Case;
use App\Application\UseCases\Product_Photo\Delete_Product_Photo_Use_Case;

use App\Application\UseCases\Market_Photo\Add_Market_Photo_Use_Case;
use App\Application\UseCases\Market_Photo\Delete_Market_Photo_Use_Case;

use App\Application\UseCases\Shopping_List_Item_Product\Assign_Products_To_ShoppingListItem_Use_Case;
use App\Application\UseCases\Shopping_List_Item_Product\Remove_ShoppingListItems_From_Product_Use_Case;
use App\Application\UseCases\Shopping_List_Item_Product\Update_ShoppingListItems_For_Product_Use_Case;

use App\Application\UseCases\Shopping_List_Item_Product_Market\Add_Product_To_Market_In_Shopping_List_Use_Case;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repository bindings
        $this->app->bind(I_Product_Repository::class, Eloquent_Product_Repository::class);
        $this->app->bind(I_Market_Repository::class, Eloquent_Market_Repository::class);
        $this->app->bind(I_Shopping_List_Item_Repository::class, Eloquent_Shopping_List_Item_Repository::class);
        $this->app->bind(I_Product_Photo_Repository::class, Eloquent_Product_Photo_Repository::class);
        $this->app->bind(I_Market_Photo_Repository::class, Eloquent_Market_Photo_Repository::class);
        $this->app->bind(I_Shopping_List_Item_Product_Market_Repository::class, Eloquent_Shopping_List_Item_Product_Market_Repository::class);

        // Product Services
        $this->app->bind(I_GetAll_Products_Use_Case::class, GetAll_Products_Use_Case::class);
        $this->app->bind(I_Get_Product_Use_Case::class, Get_Product_Use_Case::class);
        $this->app->bind(I_Create_Product_Use_Case::class, Create_Product_Use_Case::class);
        $this->app->bind(I_Update_Product_Use_Case::class, Update_Product_Use_Case::class);
        $this->app->bind(I_Delete_Product_Use_Case::class, Delete_Product_Use_Case::class);
        $this->app->bind(I_Search_Product_Use_Case::class, Search_Product_Use_Case::class);
        $this->app->bind(I_Get_Favorite_Products_Use_Case::class, Get_Favorite_Products_Use_Case::class);
        $this->app->bind(I_Get_Product_Markets_Use_Case::class, Get_Product_Markets_Use_Case::class);
        $this->app->bind(I_Get_Market_Photo_Price_Use_Case::class, Get_Market_Photo_Price_Use_Case::class);
        // Market Services
        $this->app->bind(I_GetAll_Markets_Use_Case::class, GetAll_Markets_Use_Case::class);
        $this->app->bind(I_Get_Market_UseCase::class, Get_Market_Use_Case::class);
        $this->app->bind(I_Create_Market_Use_Case::class, Create_Market_Use_Case::class);
        $this->app->bind(I_Update_Market_Use_Case::class, Update_Market_Use_Case::class);
        $this->app->bind(I_Delete_Market_Use_Case::class, Delete_Market_Use_Case::class);
        // ShoppingListItem Services
        $this->app->bind(I_GetAll_Shopping_List_Items_Use_Case::class, GetAll_Shopping_List_Items_Use_Case::class);
        $this->app->bind(I_Get_Shopping_List_Item_Use_Case::class, Get_Shopping_List_Item_Use_Case::class);
        $this->app->bind(I_Create_Shopping_List_Item_Use_Case::class, Create_Shopping_List_Item_Use_Case::class);
        $this->app->bind(I_Update_Shopping_List_Item_Use_Case::class, Update_Shopping_List_Item_Use_Case::class);
        $this->app->bind(I_Delete_Shopping_List_Item_Use_Case::class, Delete_Shopping_List_Item_Use_Case::class);
        // Product-Market Service
        $this->app->bind(I_Assign_Markets_To_Product_Use_Case::class, Assign_Markets_To_Product_Use_Case::class);
        $this->app->bind(I_Remove_Markets_From_Product_Use_Case::class, Remove_Markets_From_Product_Use_Case::class);
        $this->app->bind(I_Get_Preferred_Market_Use_Case::class, Get_Preferred_Market_Use_Case::class);
        // Product-Photo Service
        $this->app->bind(I_Add_Product_Photo_Use_Case::class, Add_Product_Photo_Use_Case::class);
        $this->app->bind(I_Delete_Product_Photo_Use_Case::class, Delete_Product_Photo_Use_Case::class);
        // Market-Photo Service
        $this->app->bind(I_Add_Market_Photo_Use_Case::class, Add_Market_Photo_Use_Case::class);
        $this->app->bind(I_Delete_Market_Photo_Use_Case::class, Delete_Market_Photo_Use_Case::class);
        // ShoppingListItem-Product Service
        $this->app->bind(I_Assign_Products_To_ShoppingListItem_Use_Case::class, Assign_Products_To_ShoppingListItem_Use_Case::class);
        $this->app->bind(I_Remove_ShoppingListItems_From_Product_Use_Case::class, Remove_ShoppingListItems_From_Product_Use_Case::class);
        $this->app->bind(I_Update_ShoppingListItems_For_Product_Use_Case::class, Update_ShoppingListItems_For_Product_Use_Case::class);
        // ShoppingListItem-Product-Market Service
        $this->app->bind(I_Add_Product_To_Market_In_Shopping_List_Use_Case::class, Add_Product_To_Market_In_Shopping_List_Use_Case::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Leave empty if not needed
    }
}
