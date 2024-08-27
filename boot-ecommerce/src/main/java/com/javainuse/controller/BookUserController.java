package com.javainuse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.javainuse.db.BookRepository;
import com.javainuse.db.BookUserRepository;
import com.javainuse.db.UserRepository;
import com.javainuse.model.Book;
import com.javainuse.model.BookUser;
import com.javainuse.model.User;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/user-books")
public class BookUserController {

    @Autowired
    private BookUserRepository userBookRepository;
    
    @Autowired
	private BookRepository bookRepository;
    
    @Autowired
	private UserRepository userRepository;

    // Create a new UserBook with query parameters
    @PostMapping("/add")
    public ResponseEntity<?> createUserBook(
            @RequestParam("userId") Long userId,
            @RequestParam("bookId") Long bookId,
            @RequestParam("quantity") Integer quantity) {

        // Check if userId or bookId or quantity is null
        if (userId == null || bookId == null || quantity == null) {
            return ResponseEntity.badRequest().body("User ID, Book ID, and Quantity are required.");
        }

        // Check if quantity is less than 1
        if (quantity < 1) {
            return ResponseEntity.badRequest().body("Quantity must be at least 1.");
        }

        // Check if the user exists
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body("User not found.");
        }

        // Check if the book exists
        Optional<Book> bookOptional = bookRepository.findById(bookId);
        if (!bookOptional.isPresent()) {
            return ResponseEntity.badRequest().body("Book not found.");
        }

        // Create a new BookUser object
        BookUser userBook = new BookUser();
        userBook.setUserId(userId);
        userBook.setBookId(bookId);
        userBook.setQuantity(quantity);

        try {
            // Save the new BookUser to the repository
            BookUser savedUserBook = userBookRepository.save(userBook);

            // Return the saved BookUser
            return ResponseEntity.ok(savedUserBook);

        } catch (DataAccessException e) {
            // Handle database exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while saving the user book: " + e.getMessage());
        }
    }

}
