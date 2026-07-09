package com.hexaware.quitq.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int productId;

    @Column(nullable = false)
    private String productName;

    private String description;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int stockNumber = 0;

    @Column(nullable = false)
    private boolean available = true;
    
    @Column
    private String imageUrl;
   
    @ManyToOne
    @JoinColumn(name = "categoryId")
    private Category category;

    
    @ManyToOne
    @JoinColumn(name = "sellerId")
    private Seller seller;

    // Getters and Setters
    public int getProductId() {
        return productId;
    }
    public void setProductId(int productId) {
        this.productId = productId;
    }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }
    public int getStockNumber() {
        return stockNumber;
    }
    public void setStockNumber(int stockNumber) {
        this.stockNumber = stockNumber;
    }
    public boolean isAvailable() {
        return available;
    }
    public void setAvailable(boolean available) {
        this.available = available;
    
    }
    public Category getCategory() {
        return category;
    }
    public void setCategory(Category category) {
        this.category = category;
    }
    public Seller getSeller() {
        return seller;
    }
    public void setSeller(Seller seller) {
        this.seller = seller;
    }
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}