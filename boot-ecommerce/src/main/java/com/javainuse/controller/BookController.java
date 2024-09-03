package com.javainuse.controller;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.javainuse.db.BookRepository;
import com.javainuse.model.Book;
import com.javainuse.model.OrderBook;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "books")
public class BookController {
	
	private byte[] bytes;

	@Autowired
	private BookRepository bookRepository;
	
	@GetMapping("/get")
	public ResponseEntity<Object> getBooks( @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", required = false, defaultValue = "id") String sort,
            @RequestParam(name="order", required = false, defaultValue = "ASC") String order) {
		
		Sort.Direction sortDirection = "DESC".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable paging = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<Book> pageBooks = bookRepository.findAll(paging);
		
        Map<String, Object> responseBody = new LinkedHashMap<>();
        if (pageBooks.hasContent()) {
            responseBody.put("books", pageBooks.getContent());
            responseBody.put("currentPage", pageBooks.getNumber());
            responseBody.put("totalItems", pageBooks.getTotalElements());
            responseBody.put("totalPages", pageBooks.getTotalPages());
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        } else {
            responseBody.put("message", "No products found");
            return new ResponseEntity<>(responseBody, HttpStatus.NOT_FOUND);
        }
	}

	@GetMapping("/search")
	public ResponseEntity<Object> searchBooks(@RequestParam("keyword") String keyword) {
	    List<Book> books = bookRepository.FindByNameOrAuthor(keyword);
	    if (!books.isEmpty()) {
	        return new ResponseEntity<>(books, HttpStatus.OK);
	    } else {
	        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No books found with the given keyword");
	    }
	}

	
	@PostMapping("/upload")
	public void uploadImage(@RequestParam("imageFile") MultipartFile file) throws IOException {
		this.bytes = file.getBytes();
	}

	@PostMapping("/add")
	public void createBook(@RequestBody Book book) throws IOException {
		book.setPicByte(this.bytes);
		bookRepository.save(book);
		this.bytes = null;
	}
	
	@DeleteMapping(path = { "/{id}" })
	public Book deleteBook(@PathVariable("id") long id) {
		//deprecated: Book book = bookRepository.getOne(id);
		Book book = bookRepository.getReferenceById(id);
		bookRepository.deleteById(id);
		return book;
	}
	
	@PutMapping("/update")
	public ResponseEntity<Book> updateBook(@RequestBody Book book) {
	    if (this.bytes != null) {
	        book.setPicByte(this.bytes);
	        this.bytes = null;  // Reset the byte array after updating the image
	    } else {
	        // Keep the existing image if no new image is uploaded
	        Book existingBook = bookRepository.findById(book.getId()).orElse(null);
	        if (existingBook != null) {
	            book.setPicByte(existingBook.getPicByte());
	        }
	    }
	    Book updatedBook = bookRepository.save(book);
	    return new ResponseEntity<>(updatedBook, HttpStatus.OK);
	}
	
	@PutMapping("/calculateFinalPrice")
	public ResponseEntity<String> calculateFinalPrice(@RequestBody Book book) {
	    try {
	        // Find the book by ID
	        Optional<Book> existingBook = bookRepository.findById(book.getId());

	        if (existingBook.isPresent()) {
	            // Update the existing book's discount and dates
	            Book saleBook = existingBook.get();
	            saleBook.setSale(book.getSale());
	            saleBook.setDateStart(book.getDateStart());
	            saleBook.setDateEnd(book.getDateEnd());

	            // Save the updated book with the calculated price
	            bookRepository.save(saleBook);

	            return ResponseEntity.ok("Final price calculated and book updated successfully.");
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Book not found");
	        }
	    } catch (NumberFormatException e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error calculating final price: Invalid price or discount format");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error calculating final price: " + e.getMessage());
	    }
	}

}