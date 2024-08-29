package com.javainuse.db;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javainuse.model.OrderBook;


public interface BookOrderRepository extends JpaRepository<OrderBook, Long> {
	
}