package com.hexaware.quitq.controller;

import com.hexaware.quitq.entity.ShippingAddress;
import com.hexaware.quitq.service.ShippingAddressService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class ShippingAddressController {

    @Autowired
    private ShippingAddressService shippingAddressService;

   
    @PostMapping("/{userId}")
    public ResponseEntity<ShippingAddress> addAddress(@PathVariable int userId,
                                                      @RequestBody ShippingAddress address) {
        return ResponseEntity.ok(shippingAddressService.addAddress(userId, address));
    }

    
    @GetMapping("/{userId}")
    public ResponseEntity<List<ShippingAddress>> getAddressesByUser(@PathVariable int userId) {
        return ResponseEntity.ok(shippingAddressService.getAddressesByUser(userId));
    }

    
    @GetMapping("/address/{addressId}")
    public ResponseEntity<ShippingAddress> getAddressById(@PathVariable int addressId) {
        return ResponseEntity.ok(shippingAddressService.getAddressById(addressId));
    }

    
    @PutMapping("/address/{addressId}")
    public ResponseEntity<ShippingAddress> updateAddress(@PathVariable int addressId,
                                                         @RequestBody ShippingAddress address) {
        return ResponseEntity.ok(shippingAddressService.updateAddress(addressId, address));
    }

   
    @DeleteMapping("/address/{addressId}")
    public ResponseEntity<?> deleteAddress(@PathVariable int addressId) {

        try {
            shippingAddressService.deleteAddress(addressId);
            return ResponseEntity.ok("Address deleted successfully!");

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }
}