package com.hexaware.quitq.dto;

public class LoginResponse {

    private String token;
    private int sellerId;
    private String name;
    private String email;
    private String role;

    public LoginResponse() {
    }

    public LoginResponse(String token, int sellerId, String name, String email, String role) {
        this.token = token;
        this.sellerId = sellerId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getSellerId() {
        return sellerId;
    }

    public void setSellerId(int sellerId) {
        this.sellerId = sellerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}