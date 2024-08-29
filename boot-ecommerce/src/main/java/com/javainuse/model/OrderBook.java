package com.javainuse.model;

import jakarta.persistence.*;

@Entity
@Table(name = "order_book")
public class OrderBook {

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "bookId")  
    private Long bookId;

    @Column(name = "orderId") 
    private Long orderId;

    @Column(nullable = false)
    private Integer quantity;
    
    @Column(name = "price")
    private Double price;

    public OrderBook() {
    }

    public OrderBook(Long orderId, Long bookId, Integer quantity, Double price) {
        this.orderId = orderId;
        this.bookId = bookId;
        this.quantity = quantity;
        this.price = price;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getBookId() {
		return bookId;
	}

	public void setBookId(Long bookId) {
		this.bookId = bookId;
	}

	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	@Override
	public String toString() {
		return "OrderBook [id=" + id + ", bookId=" + bookId + ", orderId=" + orderId + ", quantity=" + quantity
				+ ", price=" + price + "]";
	}
    
}
