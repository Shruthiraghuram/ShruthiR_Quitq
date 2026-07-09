package com.hexaware.quitq.controller;
import java.util.Map;

import com.hexaware.quitq.dto.UserDTO;
import com.hexaware.quitq.entity.User;
import com.hexaware.quitq.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

   
    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

   
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestParam String email,
                                          @RequestParam String password) {
        return ResponseEntity.ok(userService.loginUser(email, password));
    }

   
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable int userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable int userId,
                                           @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(userId, user));
    }

   
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable int userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully!");
    }
}