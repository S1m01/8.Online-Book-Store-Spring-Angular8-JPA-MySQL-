package com.javainuse.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.javainuse.db.TypeRepository;
import com.javainuse.model.Type;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "type")
public class TypeController {

	@Autowired
	private TypeRepository typeRepository;
	
	@GetMapping("/get")
    public ResponseEntity<List<Type>> getOrders() {
        try {
            List<Type> types = typeRepository.findAll();
            return ResponseEntity.ok(types);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}