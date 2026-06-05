package com.agmarknet.service;

import com.agmarknet.dto.Dtos.*;
import com.agmarknet.model.PriceArrival;
import com.agmarknet.repository.PriceArrivalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PriceArrivalService {

    private final PriceArrivalRepository priceArrivalRepository;

    public PriceArrivalPageResponse getFilteredData(
            PriceArrivalFilterRequest req
    ) {

        /*
         * Default range:
         * Last 1 year instead of last 3 days
         */

        LocalDate toDate =
                req.getToDate() != null
                        ? req.getToDate()
                        : LocalDate.now();

        LocalDate fromDate =
                req.getFromDate() != null
                        ? req.getFromDate()
                        : LocalDate.now().minusYears(1);

        // Normalize filters

        Long stateId =
                nullIfZero(req.getStateId());

        Long districtId =
                nullIfZero(req.getDistrictId());

        Long marketId =
                nullIfZero(req.getMarketId());

        Long commodityGroupId =
                nullIfZero(req.getCommodityGroupId());

        Long commodityId =
                nullIfZero(req.getCommodityId());

        Long varietyId =
                nullIfZero(req.getVarietyId());

        String grade =
                (req.getGrade() == null
                        || req.getGrade().isBlank()
                        || req.getGrade()
                        .equalsIgnoreCase("all"))
                        ? null
                        : req.getGrade();

        List<PriceArrival> allResults =
                priceArrivalRepository.findByFilters(
                        fromDate,
                        toDate,
                        stateId,
                        districtId,
                        marketId,
                        commodityGroupId,
                        commodityId,
                        varietyId,
                        grade
                );

        // Pagination

        int page =
                Math.max(0, req.getPage());

        int size =
                req.getSize() > 0
                        ? Math.min(req.getSize(), 500)
                        : 50;

        int totalElements =
                allResults.size();

        int totalPages =
                (int) Math.ceil(
                        (double) totalElements / size
                );

        int start = page * size;

        int end =
                Math.min(
                        start + size,
                        totalElements
                );

        List<PriceArrival> pageContent =
                start < totalElements
                        ? allResults.subList(start, end)
                        : new ArrayList<>();

        List<PriceArrivalDto> dtos =
                pageContent.stream()
                        .map(this::toDto)
                        .collect(Collectors.toList());

        return PriceArrivalPageResponse.builder()
                .content(dtos)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .currentPage(page)
                .pageSize(size)
                .build();
    }

    public CommodityTrendResponse getTrends(
            Long commodityId,
            Long marketId,
            Long stateId,
            int days
    ) {

        LocalDate toDate =
                LocalDate.now();

        LocalDate fromDate =
                toDate.minusDays(days);

        List<PriceArrival> records =
                priceArrivalRepository.findTrends(
                        commodityId,
                        nullIfZero(marketId),
                        nullIfZero(stateId),
                        fromDate,
                        toDate
                );

        String commodityName =
                records.isEmpty()
                        ? "Unknown"
                        : records.get(0)
                          .getCommodity()
                          .getName();

        String marketName =
                records.isEmpty()
                        || marketId == null
                        ? "All Markets"
                        : records.get(0)
                          .getMarket()
                          .getName();

        String stateName =
                records.isEmpty()
                        || stateId == null
                        ? "All States"
                        : records.get(0)
                          .getState()
                          .getName();

        List<TrendDataPoint> trendData =
                records.stream()
                        .map(p ->
                                TrendDataPoint.builder()
                                        .date(
                                                p.getArrivalDate()
                                        )
                                        .minPrice(
                                                p.getMinPrice()
                                        )
                                        .maxPrice(
                                                p.getMaxPrice()
                                        )
                                        .modalPrice(
                                                p.getModalPrice()
                                        )
                                        .arrivalQuantity(
                                                p.getArrivalQuantity()
                                        )
                                        .build()
                        )
                        .collect(Collectors.toList());

        return CommodityTrendResponse.builder()
                .commodityName(commodityName)
                .marketName(marketName)
                .stateName(stateName)
                .trendData(trendData)
                .build();
    }

    public DashboardStatsDto getDashboardStats() {

        return DashboardStatsDto.builder()
                .totalRecords(
                        priceArrivalRepository.count()
                )
                .totalStates(
                        priceArrivalRepository
                                .countDistinctStates()
                )
                .totalMarkets(
                        priceArrivalRepository
                                .countDistinctMarkets()
                )
                .totalCommodities(
                        priceArrivalRepository
                                .countDistinctCommodities()
                )
                .latestDataDate(
                        priceArrivalRepository
                                .findLatestDate()
                                .orElse(null)
                )
                .oldestDataDate(
                        priceArrivalRepository
                                .findOldestDate()
                                .orElse(null)
                )
                .build();
    }

    // ---- Mapper ----

    private PriceArrivalDto toDto(
            PriceArrival p
    ) {

        return PriceArrivalDto.builder()
                .id(p.getId())
                .arrivalDate(
                        p.getArrivalDate()
                )
                .stateName(
                        p.getState().getName()
                )
                .districtName(
                        p.getDistrict().getName()
                )
                .marketName(
                        p.getMarket().getName()
                )
                .commodityGroup(
                        p.getCommodityGroup().getName()
                )
                .commodityName(
                        p.getCommodity().getName()
                )
                .variety(
                        p.getVariety() != null
                                ? p.getVariety().getName()
                                : "Other"
                )
                .grade(p.getGrade())
                .minPrice(
                        p.getMinPrice()
                )
                .maxPrice(
                        p.getMaxPrice()
                )
                .modalPrice(
                        p.getModalPrice()
                )
                .arrivalQuantity(
                        p.getArrivalQuantity()
                )
                .priceUnit(
                        p.getPriceUnit()
                )
                .build();
    }

    private Long nullIfZero(
            Long val
    ) {

        return (
                val != null
                        && val == 0L
        )
                ? null
                : val;
    }
}