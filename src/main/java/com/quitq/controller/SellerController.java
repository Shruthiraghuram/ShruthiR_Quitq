package com.quitq.controller;

import com.quitq.model.Seller;
import com.quitq.service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sellers")
public class SellerController {

    @Autowired
    private SellerService sellerService;

    
    @PostMapping("/register")
    public ResponseEntity<Seller> registerSeller(@RequestBody Seller seller) {
        return ResponseEntity.ok(sellerService.registerSeller(seller));
    }

    
    @PostMapping("/login")
    public ResponseEntity<Seller> loginSeller(@RequestParam String email,
                                              @RequestParam String password) {
        return ResponseEntity.ok(sellerService.loginSeller(email, password));
    }

  
    @GetMapping("/{sellerId}")
    public ResponseEntity<Seller> getSellerById(@PathVariable int sellerId) {
        return ResponseEntity.ok(sellerService.getSellerById(sellerId));
    }

    
    @GetMapping
    public ResponseEntity<List<Seller>> getAllSellers() {
        return ResponseEntity.ok(sellerService.getAllSellers());
    }

 
    @PutMapping("/{sellerId}")
    public ResponseEntity<Seller> updateSeller(@PathVariable int sellerId,
                                               @RequestBody Seller seller) {
        return ResponseEntity.ok(sellerService.updateSeller(sellerId, seller));
    }


    @DeleteMapping("/{sellerId}")
    public ResponseEntity<String> deleteSeller(@PathVariable int sellerId) {
        sellerService.deleteSeller(sellerId);
        return ResponseEntity.ok("Seller deleted successfully!");
    }
}