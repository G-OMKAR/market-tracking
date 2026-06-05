package com.agmarknet.repository;

import com.agmarknet.model.Commodity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommodityRepository extends JpaRepository<Commodity, Long> {

    List<Commodity> findByCommodityGroupIdOrderByNameAsc(Long commodityGroupId);

    List<Commodity> findAllByOrderByNameAsc();

}