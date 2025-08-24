<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Services\Person\GetAllPersonsService;
use App\Application\Services\Person\CreatePersonService;
use InvalidArgumentException;
use App\Application\DTOs\PersonDto;
/**
 * @OA\Tag(
 *     name="Person",
 *     description="API Endpoints for Persons"
 * )
 */
class PersonController extends Controller
{
    private GetAllPersonsService $getAllPersonsService;
    private CreatePersonService $createPersonService;

    public function __construct(
        GetAllPersonsService $getAllPersonsService,
        CreatePersonService $createPersonService
    ) {
        $this->getAllPersonsService = $getAllPersonsService;
        $this->createPersonService = $createPersonService;
    }

    /**
     * @OA\Get(
     *     path="/api/persons",
     *     summary="Get all persons",
     *     tags={"Person"},
     *     @OA\Response(
     *         response=200,
     *         description="List of persons",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/PersonDto")
     *         )
     *     )
     * )
     */
    public function index()
    {
        // Call service to get all persons (service returns array of DTOs)
        return response()->json($this->getAllPersonsService->getAll());
    }

    /**
     * @OA\Post(
     *     path="/api/persons",
     *     summary="Create a new person",
     *     tags={"Person"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/PersonDto")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Created person",
     *         @OA\JsonContent(ref="#/components/schemas/PersonDto")
     *     )
     * )
     */


public function store(Request $request)
{
    try {
        // Manually create the DTO from request input
        $personDto = new PersonDto(null); // pass null because constructor requires Person
        $personDto->name  = $request->input('name');
        $personDto->email = $request->input('email');
        $personDto->phone = $request->input('phone');

        // Pass the DTO to the service
        $createdPerson = $this->createPersonService->create($personDto);

        return response()->json($createdPerson, 201);
    } catch (InvalidArgumentException $ex) {
        return response()->json(['message' => $ex->getMessage()], 400);
    }
}


}
