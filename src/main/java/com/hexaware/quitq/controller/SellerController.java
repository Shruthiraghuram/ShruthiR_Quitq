package com.hexaware.quitq.controller;

import com.hexaware.quitq.dto.LoginResponse;
import com.hexaware.quitq.entity.Seller;
import com.hexaware.quitq.security.JwtUtil;
import com.hexaware.quitq.service.SellerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sellers")
public class SellerController {

	@Autowired
	private JwtUtil jwtUtil;
	
		
    @Autowired
    private SellerService sellerService;

    
    @PostMapping("/register")
    public ResponseEntity<Seller> registerSeller(@RequestBody Seller seller) {
        return ResponseEntity.ok(sellerService.registerSeller(seller));
    }

    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginSeller(@RequestParam String email,
            @RequestParam String password) {

Seller seller = sellerService.loginSeller(email, password);

String token = jwtUtil.generateToken(seller.getEmail(), "SELLER");

LoginResponse response = new LoginResponse(
token,
seller.getSellerId(),
seller.getName(),
seller.getEmail(),
"SELLER"
);

return ResponseEntity.ok(response);
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