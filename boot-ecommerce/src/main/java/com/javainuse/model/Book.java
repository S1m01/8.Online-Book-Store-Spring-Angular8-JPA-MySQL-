package com.javainuse.model;

import java.util.Date;
import java.util.Set;

import org.springframework.data.jpa.repository.Query;

import jakarta.persistence.*;

@Entity
@Table(name = "book")
@NamedQuery(name = "Book.FindByNameOrAuthor", query = "SELECT b FROM Book b WHERE LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))")
public class Book {

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "name")
	private String name;

	@Column(name = "author")
	private String author;

	@Column(name = "price")
	private String price;
	
	@Column(name = "sale")
	private String sale;
	
	@Column(name = "dateStart")
	private Date dateStart;
	
	@Column(name = "dateEnd")
	private Date dateEnd;
	
	@Column(name = "picByte", length = 100000)
	private byte[] picByte;

	public Book(String sale, Date dateStart, Date dateEnd) {
		this.sale = sale;
		this.dateStart = dateStart;
		this.dateEnd = dateEnd;
	}

	public Book() {
	}

	public String getSale() {
		return sale;
	}

	public void setSale(String sale) {
		this.sale = sale;
	}

	public Date getDateStart() {
		return dateStart;
	}

	public void setDateStart(Date dateStart) {
		this.dateStart = dateStart;
	}

	public Date getDateEnd() {
		return dateEnd;
	}

	public void setDateEnd(Date dateEnd) {
		this.dateEnd = dateEnd;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public byte[] getPicByte() {
		return picByte;
	}

	public void setPicByte(byte[] picByte) {
		this.picByte = picByte;
	}
}