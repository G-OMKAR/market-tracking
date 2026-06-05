package com.agmarknet.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

// ============================
// Reference Data DTOs
// ============================

public class Dtos {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class StateDto {
        private Long id;
        private String name;
        private String code;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DistrictDto {
        private Long id;
        private String name;
        private Long stateId;
        private String stateName;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class MarketDto {
        private Long id;
        private String name;
        private Long districtId;
        private String districtName;
        private Long stateId;
        private String stateName;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CommodityGroupDto {
        private Long id;
        private String name;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CommodityDto {
        private Long id;
        private String name;
        private Long commodityGroupId;
        private String commodityGroupName;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class VarietyDto {
        private Long id;
        private String name;
        private Long commodityId;
        private String commodityName;
    }

    // ============================
    // Price Arrival DTOs
    // ============================

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PriceArrivalDto {
        private Long id;
        private LocalDate arrivalDate;
        private String stateName;
        private String districtName;
        private String marketName;
        private String commodityGroup;
        private String commodityName;
        private String variety;
        private String grade;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private BigDecimal modalPrice;
        private BigDecimal arrivalQuantity;
        private String priceUnit;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PriceArrivalFilterRequest {
        private Long stateId;
        private Long districtId;
        private Long marketId;
        private Long commodityGroupId;
        private Long commodityId;
        private Long varietyId;
        private String grade;
        private LocalDate fromDate;
        private LocalDate toDate;
        private int page;
        private int size;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PriceArrivalPageResponse {
        private List<PriceArrivalDto> content;
        private long totalElements;
        private int totalPages;
        private int currentPage;
        private int pageSize;
    }

    // ============================
    // Summary / Statistics DTOs
    // ============================

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PriceSummaryDto {
        private String commodityName;
        private String marketName;
        private String stateName;
        private BigDecimal avgMinPrice;
        private BigDecimal avgMaxPrice;
        private BigDecimal avgModalPrice;
        private BigDecimal totalArrival;
        private LocalDate latestDate;
        private long recordCount;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TrendDataPoint {
        private LocalDate date;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private BigDecimal modalPrice;
        private BigDecimal arrivalQuantity;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CommodityTrendResponse {
        private String commodityName;
        private String marketName;
        private String stateName;
        private List<TrendDataPoint> trendData;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DashboardStatsDto {
        private long totalRecords;
        private long totalStates;
        private long totalMarkets;
        private long totalCommodities;
        private LocalDate latestDataDate;
        private LocalDate oldestDataDate;
    }

    // ============================
    // API Response Wrapper
    // ============================

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public static <T> ApiResponse<T> success(T data) {
            return ApiResponse.<T>builder()
                    .success(true)
                    .message("Success")
                    .data(data)
                    .build();
        }

        public static <T> ApiResponse<T> error(String message) {
            return ApiResponse.<T>builder()
                    .success(false)
                    .message(message)
                    .data(null)
                    .build();
        }
    }
}
