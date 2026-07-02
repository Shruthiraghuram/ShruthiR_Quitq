package com.quitq.service;
import com.quitq.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


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
	 private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

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

   
 // Place order
    public Order placeOrder(int userId, int addressId, String paymentMethod) {
        logger.info("Placing order for user ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", userId);
                    return new ResourceNotFoundException("User not found!");
                });

        ShippingAddress address = shippingAddressRepository.findById(addressId)
                .orElseThrow(() -> {
                    logger.error("Address not found with ID: {}", addressId);
                    return new ResourceNotFoundException("Address not found!");
                });

        List<CartItem> cartItems = cartService.getCartItems(userId);
        if (cartItems.isEmpty()) {
            logger.error("Cart is empty for user ID: {}", userId);
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
        logger.info("Order placed successfully with ID: {}", savedOrder.getOrderId());

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
        logger.info("Cart cleared after order placement for user ID: {}", userId);
        return savedOrder;
    }

    // Get all orders of a user
    public List<Order> getOrdersByUser(int userId) {
        logger.info("Fetching orders for user ID: {}", userId);
        return orderRepository.findByUserUserId(userId);
    }

    // Get order by ID
    public Order getOrderById(int orderId) {
        logger.info("Fetching order with ID: {}", orderId);
        return orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    logger.error("Order not found with ID: {}", orderId);
                    return new ResourceNotFoundException("Order not found!");
                });
    }

    // Get order items by order
    public List<OrderItem> getOrderItems(int orderId) {
        logger.info("Fetching order items for order ID: {}", orderId);
        return orderItemRepository.findByOrderOrderId(orderId);
    }

    // Update order status
    public Order updateOrderStatus(int orderId, Order.OrderStatus status) {
        logger.info("Updating order status for order ID: {} to {}", orderId, status);
        Order order = getOrderById(orderId);
        order.setStatus(status);
        Order saved = orderRepository.save(order);
        logger.info("Order status updated successfully for order ID: {}", orderId);
        return saved;
    }

    // Update payment status
    public Order updatePaymentStatus(int orderId, Order.PaymentStatus paymentStatus) {
        logger.info("Updating payment status for order ID: {} to {}", orderId, paymentStatus);
        Order order = getOrderById(orderId);
        order.setPaymentStatus(paymentStatus);
        Order saved = orderRepository.save(order);
        logger.info("Payment status updated successfully for order ID: {}", orderId);
        return saved;
    }

    // Get all orders by seller
    public List<OrderItem> getOrdersBySeller(int sellerId) {
        logger.info("Fetching orders for seller ID: {}", sellerId);
        return orderItemRepository.findBySellerSellerId(sellerId);
    }

    // Cancel order
    public Order cancelOrder(int orderId) {
        logger.info("Cancelling order with ID: {}", orderId);
        Order order = getOrderById(orderId);
        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            logger.error("Cannot cancel delivered order with ID: {}", orderId);
            throw new RuntimeException("Delivered order cannot be cancelled!");
        }
        order.setStatus(Order.OrderStatus.CANCELLED);
        Order saved = orderRepository.save(order);
        logger.info("Order cancelled successfully with ID: {}", orderId);
        return saved;
    }
}