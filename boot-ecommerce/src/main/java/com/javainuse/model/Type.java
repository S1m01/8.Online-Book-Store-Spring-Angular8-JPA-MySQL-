package com.javainuse.model;

import jakarta.persistence.*;

@Entity
@Table(name = "type")
public class Type {

	@Id
	@Column(name = "cod")
	private String cod;

	@Column(name = "name_cod")  
    private String nameCod;

    
    public Type() {
    }


	public String getCod() {
		return cod;
	}


	public void setCod(String cod) {
		this.cod = cod;
	}


	public String getNameCod() {
		return nameCod;
	}


	public void setNameCod(String nameCod) {
		this.nameCod = nameCod;
	}
	
    
}
