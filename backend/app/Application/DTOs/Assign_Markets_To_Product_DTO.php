<?php
namespace App\Application\DTOs;

/**
 * @OA\Schema(
 *     schema="Assign_Markets_To_Product_DTO",
 *     type="object",
 *     required={"ProductID","Markets"},
 *     @OA\Property(property="ProductID", type="integer"),
 *     @OA\Property(
 *         property="Markets",
 *         type="array",
 *         @OA\Items(
 *             type="object",
 *             required={"MarketID","Price","Discount","FinalPrice"},
 *             @OA\Property(property="MarketID", type="integer"),
 *             @OA\Property(property="Price", type="number", format="float"),
 *             @OA\Property(property="Discount", type="number", format="float"),
 *             @OA\Property(property="FinalPrice", type="number", format="float")
 *         ),
 *         description="Array of market objects with ID, price, discount, and final price"
 *     )
 * )
 */
class Assign_Markets_To_Product_DTO
{
    public int $ProductID;
    public array $Markets; // array of ['MarketID'=>int,'Price'=>float,'Discount'=>float,'FinalPrice'=>float]

    public function __construct(int $ProductID, array $Markets)
    {
        $this->ProductID = $ProductID;

        foreach ($Markets as $market) {
            if (!isset($market['Price'], $market['Discount'], $market['FinalPrice'])) {
                throw new \InvalidArgumentException(
                    'Each market must have Price, Discount, and FinalPrice'
                );
            }
        }

        $this->Markets = $Markets;
    }
}
