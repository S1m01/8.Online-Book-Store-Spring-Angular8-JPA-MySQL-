package com.javainuse.db;

import org.springframework.data.jpa.repository.JpaRepository;
import com.javainuse.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

		
}