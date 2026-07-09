package com.hexaware.quitq.controller;

import com.hexaware.quitq.entity.Order;
import com.hexaware.quitq.entity.OrderItem;
import com.hexaware.quitq.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    
    @PostMapping("/{userId}")
    public ResponseEntity<Order> placeOrder(@PathVariable int userId,
                                            @RequestParam int addressId,
                                            @RequestParam String paymentMethod) {
        return ResponseEntity.ok(orderService.placeOrder(userId, addressId, paymentMethod));
    }

    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable int userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable int orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    
    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItem>> getOrderItems(@PathVariable int orderId) {
        return ResponseEntity.ok(orderService.getOrderItems(orderId));
    }

    
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable int orderId,
                                                   @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    
    @PutMapping("/{orderId}/payment")
    public ResponseEntity<Order> updatePaymentStatus(@PathVariable int orderId,
                                                     @RequestParam Order.PaymentStatus paymentStatus) {
        return ResponseEntity.ok(orderService.updatePaymentStatus(orderId, paymentStatus));
    }

    
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<OrderItem>> getOrdersBySeller(@PathVariable int sellerId) {
        return ResponseEntity.ok(orderService.getOrdersBySeller(sellerId));
    }

    
    @DeleteMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable int orderId) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId));
    }
}