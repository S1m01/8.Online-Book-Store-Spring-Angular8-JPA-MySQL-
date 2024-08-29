package com.javainuse.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.javainuse.db.OrderRepository;
import com.javainuse.model.Order;

import jakarta.validation.Valid;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "order")
public class OrderController {

	@Autowired
	private OrderRepository orderRepository;
	
	 @GetMapping("/get")
	    public ResponseEntity<List<Order>> getOrders() {
	        try {
	            List<Order> orders = orderRepository.findAll();
	            return ResponseEntity.ok(orders);
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	        }
	    }

	    @PostMapping("/add")
	    public ResponseEntity<String> createOrder(@Valid @RequestBody Order order) {
	        try {
	            orderRepository.save(order);
	            return ResponseEntity.status(HttpStatus.CREATED).body("Order created successfully.");
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating the order.");
	        }
	    }
}