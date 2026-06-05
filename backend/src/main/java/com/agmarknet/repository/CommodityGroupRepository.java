package com.agmarknet.repository;

import com.agmarknet.model.CommodityGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommodityGroupRepository extends JpaRepository<CommodityGroup, Long> {

    List<CommodityGroup> findAllByOrderByNameAsc();

}