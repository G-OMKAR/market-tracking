package com.agmarknet.controller;

import com.agmarknet.dto.Dtos.*;
import com.agmarknet.service.ReferenceDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reference")
@RequiredArgsConstructor
@Tag(name = "Reference Data", description = "States, Districts, Markets, Commodities lookup")
public class ReferenceDataController {

    private final ReferenceDataService referenceDataService;

    @GetMapping("/states")
    @Operation(summary = "Get all states")
    public ResponseEntity<ApiResponse<List<StateDto>>> getAllStates() {
        return ResponseEntity.ok(ApiResponse.success(referenceDataService.getAllStates()));
    }

    @GetMapping("/districts")
    @Operation(summary = "Get districts, optionally filtered by state")
    public ResponseEntity<ApiResponse<List<DistrictDto>>> getDistricts(
            @RequestParam(required = false) Long stateId) {
        return ResponseEntity.ok(ApiResponse.success(referenceDataService.getDistricts(stateId)));
    }

    @GetMapping("/markets")
    @Operation(summary = "Get markets, optionally filtered by state and/or district")
    public ResponseEntity<ApiResponse<List<MarketDto>>> getMarkets(
            @RequestParam(required = false) Long stateId,
            @RequestParam(required = false) Long districtId) {
        return ResponseEntity.ok(ApiResponse.success(referenceDataService.getMarkets(stateId, districtId)));
    }

    @GetMapping("/commodity-groups")
    @Operation(summary = "Get all commodity groups")
    public ResponseEntity<ApiResponse<List<CommodityGroupDto>>> getCommodityGroups() {
        return ResponseEntity.ok(ApiResponse.success(referenceDataService.getAllCommodityGroups()));
    }

    @GetMapping("/commodities")
    @Operation(summary = "Get commodities, optionally filtered by group")
    public ResponseEntity<ApiResponse<List<CommodityDto>>> getCommodities(
            @RequestParam(required = false) Long groupId) {
        return ResponseEntity.ok(ApiResponse.success(referenceDataService.getCommodities(groupId)));
    }

    @GetMapping("/varieties")
    @Operation(summary = "Get varieties, optionally filtered by commodity")
    public ResponseEntity<ApiResponse<List<VarietyDto>>> getVarieties(
            @RequestParam(required = false) Long commodityId) {
        return ResponseEntity.ok(ApiResponse.success(referenceDataService.getVarieties(commodityId)));
    }
}
