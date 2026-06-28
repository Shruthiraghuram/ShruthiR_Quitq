package com.quitq.controller;

import com.quitq.model.CartItem;
import com.quitq.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    
    @PostMapping("/{userId}/add")
    public ResponseEntity<CartItem> addItemToCart(@PathVariable int userId,
                                                   @RequestParam int productId,
                                                   @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.addItemToCart(userId, productId, quantity));
    }

    
    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable int userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    
    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable int cartItemId,
                                                   @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateCartItem(cartItemId, quantity));
    }

    
    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<String> removeItemFromCart(@PathVariable int cartItemId) {
        cartService.removeItemFromCart(cartItemId);
        return ResponseEntity.ok("Item removed from cart!");
    }

    
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<String> clearCart(@PathVariable int userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared successfully!");
    }
}