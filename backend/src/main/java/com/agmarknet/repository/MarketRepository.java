package com.agmarknet.repository;

import com.agmarknet.model.Market;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarketRepository extends JpaRepository<Market, Long> {

    List<Market> findByDistrictIdOrderByNameAsc(Long districtId);

    List<Market> findByDistrictStateIdOrderByNameAsc(Long stateId);

    List<Market> findAllByOrderByNameAsc();

}