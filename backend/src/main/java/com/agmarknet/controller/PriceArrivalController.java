package com.agmarknet.controller;

import com.agmarknet.dto.Dtos.*;
import com.agmarknet.service.PriceArrivalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/prices")
@RequiredArgsConstructor
@Tag(name = "Price & Arrival Data", description = "Market wise price and arrival data")
public class PriceArrivalController {

    private final PriceArrivalService priceArrivalService;

    @GetMapping
    @Operation(summary = "Get filtered price arrival data with pagination")
    public ResponseEntity<ApiResponse<PriceArrivalPageResponse>> getPrices(
            @RequestParam(required = false) Long stateId,
            @RequestParam(required = false) Long districtId,
            @RequestParam(required = false) Long marketId,
            @RequestParam(required = false) Long commodityGroupId,
            @RequestParam(required = false) Long commodityId,
            @RequestParam(required = false) Long varietyId,
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PriceArrivalFilterRequest req = PriceArrivalFilterRequest.builder()
                .stateId(stateId)
                .districtId(districtId)
                .marketId(marketId)
                .commodityGroupId(commodityGroupId)
                .commodityId(commodityId)
                .varietyId(varietyId)
                .grade(grade)
                .fromDate(fromDate)
                .toDate(toDate)
                .page(page)
                .size(size)
                .build();

        return ResponseEntity.ok(ApiResponse.success(priceArrivalService.getFilteredData(req)));
    }

    @GetMapping("/trends")
    @Operation(summary = "Get price trend data for a commodity over time")
    public ResponseEntity<ApiResponse<CommodityTrendResponse>> getTrends(
            @RequestParam Long commodityId,
            @RequestParam(required = false) Long marketId,
            @RequestParam(required = false) Long stateId,
            @RequestParam(defaultValue = "30") int days) {

        return ResponseEntity.ok(
                ApiResponse.success(priceArrivalService.getTrends(commodityId, marketId, stateId, days)));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(priceArrivalService.getDashboardStats()));
    }
}
