package com.hexaware.quitq.controller;

import com.hexaware.quitq.dto.ProductDTO;
import com.hexaware.quitq.dto.UserDTO;
import com.hexaware.quitq.entity.Admin;
import com.hexaware.quitq.entity.Order;
import com.hexaware.quitq.entity.Seller;
import com.hexaware.quitq.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginAdmin(@RequestParam String email,
                                                          @RequestParam String password) {
        return ResponseEntity.ok(adminService.loginAdmin(email, password));
    }

    @GetMapping("/{adminId}")
    public ResponseEntity<Admin> getAdminById(@PathVariable int adminId) {
        return ResponseEntity.ok(adminService.getAdminById(adminId));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable int userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully!");
    }

    @DeleteMapping("/sellers/{sellerId}")
    public ResponseEntity<String> deleteSeller(@PathVariable int sellerId) {
        adminService.deleteSeller(sellerId);
        return ResponseEntity.ok("Seller deleted successfully!");
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Long>> getDashboardCounts() {
        return ResponseEntity.ok(adminService.getDashboardCounts());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/sellers")
    public ResponseEntity<List<Seller>> getAllSellers() {
        return ResponseEntity.ok(adminService.getAllSellers());
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(adminService.getAllProducts());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }
}