package com.quitq.service;
import com.quitq.exception.ResourceNotFoundException;


import com.quitq.model.Order;
import com.quitq.model.OrderItem;
import com.quitq.model.CartItem;
import com.quitq.model.ShippingAddress;
import com.quitq.model.User;
import com.quitq.repository.OrderRepository;
import com.quitq.repository.OrderItemRepository;
import com.quitq.repository.ShippingAddressRepository;
import com.quitq.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ShippingAddressRepository shippingAddressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

   
    public Order placeOrder(int userId, int addressId, String paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        ShippingAddress address = shippingAddressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found!"));

       
        List<CartItem> cartItems = cartService.getCartItems(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty!");
        }

       
        double totalAmount = 0;
        for (CartItem cartItem : cartItems) {
            totalAmount += cartItem.getProduct().getPrice() * cartItem.getQuantity();
        }

        
        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(address);
        order.setTotalAmount(totalAmount);
        order.setPaymentMethod(paymentMethod);
        order.setStatus(Order.OrderStatus.PLACED);
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        Order savedOrder = orderRepository.save(order);

     
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setSeller(cartItem.getProduct().getSeller());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(cartItem.getProduct().getPrice());
            orderItemRepository.save(orderItem);
        }

        
        cartService.clearCart(userId);

        return savedOrder;
    }

   
    public List<Order> getOrdersByUser(int userId) {
        return orderRepository.findByUserUserId(userId);
    }

   
    public Order getOrderById(int orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found!"));
    }

    
    public List<OrderItem> getOrderItems(int orderId) {
        return orderItemRepository.findByOrderOrderId(orderId);
    }

    
    public Order updateOrderStatus(int orderId, Order.OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }

  
    public Order updatePaymentStatus(int orderId, Order.PaymentStatus paymentStatus) {
        Order order = getOrderById(orderId);
        order.setPaymentStatus(paymentStatus);
        return orderRepository.save(order);
    }

    
    public List<OrderItem> getOrdersBySeller(int sellerId) {
        return orderItemRepository.findBySellerSellerId(sellerId);
    }

    
    public Order cancelOrder(int orderId) {
        Order order = getOrderById(orderId);
        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new RuntimeException("Delivered order cannot be cancelled!");
        }
        order.setStatus(Order.OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }
}