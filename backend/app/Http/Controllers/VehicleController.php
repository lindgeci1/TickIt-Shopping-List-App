<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\Services\Vehicle\GetAllVehiclesService;
use App\Application\Services\Vehicle\CreateVehicleService;
use App\Application\Services\Vehicle\GetVehicleService;
use App\Application\Services\Vehicle\UpdateVehicleService;
use App\Application\Services\Vehicle\DeleteVehicleService;
use App\Application\DTOs\VehicleDto;
use InvalidArgumentException;

/**
 * @OA\Tag(
 *     name="Vehicle",
 *     description="API Endpoints for Vehicles"
 * )
 */
class VehicleController extends Controller
{
    private GetAllVehiclesService $getAllVehiclesService;
    private CreateVehicleService $createVehicleService;
    private GetVehicleService $getVehicleService;
    private UpdateVehicleService $updateVehicleService;
    private DeleteVehicleService $deleteVehicleService;

    public function __construct(
        GetAllVehiclesService $getAllVehiclesService,
        CreateVehicleService $createVehicleService,
        GetVehicleService $getVehicleService,
        UpdateVehicleService $updateVehicleService,
        DeleteVehicleService $deleteVehicleService
    ) {
        $this->getAllVehiclesService = $getAllVehiclesService;
        $this->createVehicleService = $createVehicleService;
        $this->getVehicleService = $getVehicleService;
        $this->updateVehicleService = $updateVehicleService;
        $this->deleteVehicleService = $deleteVehicleService;
    }

    /**
     * @OA\Get(
     *     path="/api/vehicle/all",
     *     summary="Get all vehicles",
     *     tags={"Vehicle"},
     *     @OA\Response(
     *         response=200,
     *         description="List of vehicles",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/VehicleDto"))
     *     )
     * )
     */
    public function index()
    {
        return response()->json($this->getAllVehiclesService->getAll());
    }

    /**
     * @OA\Get(
     *     path="/api/vehicle/{VehicleID}",
     *     summary="Get a vehicle by VehicleID",
     *     tags={"Vehicle"},
     *     @OA\Parameter(name="VehicleID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Vehicle found", @OA\JsonContent(ref="#/components/schemas/VehicleDto")),
     *     @OA\Response(response=404, description="Vehicle not found")
     * )
     */
    public function show(int $VehicleID)
    {
        try {
            $vehicle = $this->getVehicleService->getById($VehicleID);
            return response()->json($vehicle);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 404);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/vehicle/create",
     *     summary="Create a new vehicle",
     *     tags={"Vehicle"},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/VehicleDto")),
     *     @OA\Response(response=201, description="Created vehicle", @OA\JsonContent(ref="#/components/schemas/VehicleDto"))
     * )
     */
    public function store(Request $request)
    {
        try {
            $vehicleDto = new VehicleDto(null);
            $vehicleDto->make     = $request->input('make');
            $vehicleDto->modelName    = $request->input('modelName');
            $vehicleDto->year     = $request->input('year');
            $vehicleDto->pricePerDay     = $request->input('pricePerDay');
            $vehicleDto->PersonID = $request->input('PersonID');

            $createdVehicle = $this->createVehicleService->create($vehicleDto);

            return response()->json($createdVehicle, 201);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/vehicle/update/{VehicleID}",
     *     summary="Update a vehicle",
     *     tags={"Vehicle"},
     *     @OA\Parameter(name="VehicleID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/VehicleDto")),
     *     @OA\Response(response=200, description="Updated vehicle", @OA\JsonContent(ref="#/components/schemas/VehicleDto")),
     *     @OA\Response(response=400, description="Validation error"),
     *     @OA\Response(response=404, description="Vehicle not found")
     * )
     */
    public function update(Request $request, int $VehicleID)
    {
        try {
            $vehicleDto = new VehicleDto(null);
            $vehicleDto->VehicleID = $VehicleID;
            $vehicleDto->make      = $request->input('make');
            $vehicleDto->modelName     = $request->input('modelName');
            $vehicleDto->year      = $request->input('year');
            $vehicleDto->pricePerDay      = $request->input('pricePerDay');
            $vehicleDto->PersonID  = $request->input('PersonID');

            $updatedVehicle = $this->updateVehicleService->update($vehicleDto);

            return response()->json($updatedVehicle, 200);
        } catch (InvalidArgumentException $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/vehicle/delete/{VehicleID}",
     *     summary="Delete a vehicle",
     *     tags={"Vehicle"},
     *     @OA\Parameter(name="VehicleID", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=204, description="Vehicle deleted"),
     *     @OA\Response(response=404, description="Vehicle not found")
     * )
     */
    public function destroy(int $VehicleID)
    {
        try {
            $message = $this->deleteVehicleService->delete($VehicleID);
            return response()->json(['message' => $message], 200);
        } catch (\Exception $ex) {
            return response()->json(['message' => $ex->getMessage()], 400);
        }
    }
}
