<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Services\Person\GetAllPersonsService;
use App\Application\Services\Person\CreatePersonService;
use App\Application\Services\Person\GetPersonService;
use App\Application\Services\Person\UpdatePersonService;
use App\Application\Services\Person\DeletePersonService;
use App\Application\DTOs\PersonDto;
use InvalidArgumentException;

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
    private GetPersonService $getPersonService;
    private UpdatePersonService $updatePersonService;
    private DeletePersonService $deletePersonService;

    public function __construct(
        GetAllPersonsService $getAllPersonsService,
        CreatePersonService $createPersonService,
        GetPersonService $getPersonService,
        UpdatePersonService $updatePersonService,
        DeletePersonService $deletePersonService
    ) {
        $this->getAllPersonsService = $getAllPersonsService;
        $this->createPersonService = $createPersonService;
        $this->getPersonService = $getPersonService;
        $this->updatePersonService = $updatePersonService;
        $this->deletePersonService = $deletePersonService;
    }

    /**
     * @OA\Get(
     *     path="/api/person/all",
     *     summary="Get all people",
     *     tags={"Person"},
     *     @OA\Response(
     *         response=200,
     *         description="List of people",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/PersonDto"))
     *     )
     * )
     */
    public function index()
    {
        return response()->json($this->getAllPersonsService->getAll());
    }


        /**
     * @OA\Get(
     *     path="/api/person/{PersonID}",
     *     summary="Get a person by PersonID",
     *     tags={"Person"},
     *     @OA\Parameter(name="PersonID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Person found", @OA\JsonContent(ref="#/components/schemas/PersonDto")),
     *     @OA\Response(response=404, description="Person not found")
     * )
     */
    public function show(int $PersonID)
    {
        try {
            $person = $this->getPersonService->getById($PersonID);
            return response()->json($person);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }


    /**
     * @OA\Post(
     *     path="/api/person/create",
     *     summary="Create a new person",
     *     tags={"Person"},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/PersonDto")),
     *     @OA\Response(response=201, description="Created person", @OA\JsonContent(ref="#/components/schemas/PersonDto"))
     * )
     */
    public function store(Request $request)
    {
        try {
            $personDto = new PersonDto(null);
            $personDto->name  = $request->input('name');
            $personDto->email = $request->input('email');
            $personDto->phone = $request->input('phone');

            $createdPerson = $this->createPersonService->create($personDto);

            return response()->json($createdPerson, 201);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }



    /**
     * @OA\Put(
     *     path="/api/person/update/{PersonID}",
     *     summary="Update a person",
     *     tags={"Person"},
     *     @OA\Parameter(name="PersonID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/PersonDto")),
     *     @OA\Response(response=200, description="Updated person", @OA\JsonContent(ref="#/components/schemas/PersonDto")),
     *     @OA\Response(response=400, description="Validation error"),
     *     @OA\Response(response=404, description="Person not found")
     * )
     */
    public function update(Request $request, int $id)
    {
        try {
            $personDto = new PersonDto(null);
            $personDto->PersonID = $id;        // ✅ ndryshuar nga id → PersonID
            $personDto->name     = $request->input('name');
            $personDto->email    = $request->input('email');
            $personDto->phone    = $request->input('phone');

            $updatedPerson = $this->updatePersonService->update($personDto);

            return response()->json($updatedPerson, 200);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/person/delete/{PersonID}",
     *     summary="Delete a person",
     *     tags={"Person"},
     *     @OA\Parameter(name="PersonID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=204, description="Person deleted"),
     *     @OA\Response(response=404, description="Person not found")
     * )
     */
        public function destroy(int $PersonID)
        {
            try {
                $message = $this->deletePersonService->delete($PersonID);
                return response()->json(['message' => $message], 200);
            } catch (\Exception $ex) {
                return response()->json(['message' => $ex->getMessage()], 400);
            }
        }

}
