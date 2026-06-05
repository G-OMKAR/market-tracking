package com.agmarknet.repository;

import com.agmarknet.model.Variety;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VarietyRepository extends JpaRepository<Variety, Long> {

    List<Variety> findByCommodityIdOrderByNameAsc(Long commodityId);

    List<Variety> findAllByOrderByNameAsc();

}