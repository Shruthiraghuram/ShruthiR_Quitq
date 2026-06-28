package com.quitq.controller;

import com.quitq.model.Admin;
import com.quitq.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    
    @PostMapping("/login")
    public ResponseEntity<Admin> loginAdmin(@RequestParam String email,
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
}