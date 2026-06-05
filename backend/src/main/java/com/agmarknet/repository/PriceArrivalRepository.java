package com.agmarknet.repository;

import com.agmarknet.model.PriceArrival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface PriceArrivalRepository extends JpaRepository<PriceArrival, Long> {

    @Query("""
        SELECT p FROM PriceArrival p
        WHERE (:fromDate IS NULL OR p.arrivalDate >= :fromDate)
        AND (:toDate IS NULL OR p.arrivalDate <= :toDate)
        AND (:stateId IS NULL OR p.state.id = :stateId)
        AND (:districtId IS NULL OR p.district.id = :districtId)
        AND (:marketId IS NULL OR p.market.id = :marketId)
        AND (:commodityGroupId IS NULL OR p.commodityGroup.id = :commodityGroupId)
        AND (:commodityId IS NULL OR p.commodity.id = :commodityId)
        AND (:varietyId IS NULL OR p.variety.id = :varietyId)
        AND (:grade IS NULL OR p.grade = :grade)
        ORDER BY p.arrivalDate DESC
    """)
    List<PriceArrival> findByFilters(
            LocalDate fromDate,
            LocalDate toDate,
            Long stateId,
            Long districtId,
            Long marketId,
            Long commodityGroupId,
            Long commodityId,
            Long varietyId,
            String grade
    );

    @Query("""
        SELECT p FROM PriceArrival p
        WHERE p.commodity.id = :commodityId
        AND (:marketId IS NULL OR p.market.id = :marketId)
        AND (:stateId IS NULL OR p.state.id = :stateId)
        AND p.arrivalDate BETWEEN :fromDate AND :toDate
        ORDER BY p.arrivalDate ASC
    """)
    List<PriceArrival> findTrends(
            @org.springframework.data.repository.query.Param("commodityId")
            Long commodityId,

            @org.springframework.data.repository.query.Param("marketId")
            Long marketId,

            @org.springframework.data.repository.query.Param("stateId")
            Long stateId,

            @org.springframework.data.repository.query.Param("fromDate")
            LocalDate fromDate,

            @org.springframework.data.repository.query.Param("toDate")
            LocalDate toDate
    );

    @Query("SELECT COUNT(DISTINCT p.state.id) FROM PriceArrival p")
    long countDistinctStates();

    @Query("SELECT COUNT(DISTINCT p.market.id) FROM PriceArrival p")
    long countDistinctMarkets();

    @Query("SELECT COUNT(DISTINCT p.commodity.id) FROM PriceArrival p")
    long countDistinctCommodities();

    @Query("SELECT MAX(p.arrivalDate) FROM PriceArrival p")
    java.util.Optional<LocalDate> findLatestDate();

    @Query("SELECT MIN(p.arrivalDate) FROM PriceArrival p")
    java.util.Optional<LocalDate> findOldestDate();

}