package com.quitq.service;
import com.quitq.exception.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.quitq.model.Cart;
import com.quitq.model.CartItem;
import com.quitq.model.Product;
import com.quitq.model.User;
import com.quitq.repository.CartRepository;
import com.quitq.repository.CartItemRepository;
import com.quitq.repository.ProductRepository;
import com.quitq.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
	private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

   
 // Get or create cart for user
    public Cart getOrCreateCart(int userId) {
        logger.info("Getting or creating cart for user ID: {}", userId);
        Optional<Cart> cart = cartRepository.findByUserUserId(userId);
        if (cart.isPresent()) {
            logger.info("Cart found for user ID: {}", userId);
            return cart.get();
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", userId);
                    return new ResourceNotFoundException("User not found!");
                });
        Cart newCart = new Cart();
        newCart.setUser(user);
        Cart savedCart = cartRepository.save(newCart);
        logger.info("New cart created for user ID: {}", userId);
        return savedCart;
    }

    // Add item to cart
    public CartItem addItemToCart(int userId, int productId, int quantity) {
        logger.info("Adding product ID: {} to cart for user ID: {}", productId, userId);
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> {
                    logger.error("Product not found with ID: {}", productId);
                    return new ResourceNotFoundException("Product not found!");
                });

        Optional<CartItem> existingItem = cartItemRepository
                .findByCartCartIdAndProductProductId(cart.getCartId(), productId);

        if (existingItem.isPresent()) {
            logger.info("Product already in cart, updating quantity");
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        }

        CartItem newItem = new CartItem();
        newItem.setCart(cart);
        newItem.setProduct(product);
        newItem.setQuantity(quantity);
        CartItem savedItem = cartItemRepository.save(newItem);
        logger.info("Item added to cart successfully with ID: {}", savedItem.getCartItemId());
        return savedItem;
    }

    // Get all items in cart
    public List<CartItem> getCartItems(int userId) {
        logger.info("Fetching cart items for user ID: {}", userId);
        Cart cart = getOrCreateCart(userId);
        return cartItemRepository.findByCartCartId(cart.getCartId());
    }

    // Update item quantity
    public CartItem updateCartItem(int cartItemId, int quantity) {
        logger.info("Updating cart item ID: {} with quantity: {}", cartItemId, quantity);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> {
                    logger.error("Cart item not found with ID: {}", cartItemId);
                    return new ResourceNotFoundException("Cart item not found!");
                });
        item.setQuantity(quantity);
        CartItem saved = cartItemRepository.save(item);
        logger.info("Cart item updated successfully with ID: {}", cartItemId);
        return saved;
    }

    // Remove item from cart
    public void removeItemFromCart(int cartItemId) {
        logger.info("Removing cart item with ID: {}", cartItemId);
        cartItemRepository.deleteById(cartItemId);
        logger.info("Cart item removed successfully with ID: {}", cartItemId);
    }

    // Clear cart
    @Transactional
    public void clearCart(int userId) {
        logger.info("Clearing cart for user ID: {}", userId);
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCartCartId(cart.getCartId());
        logger.info("Cart cleared successfully for user ID: {}", userId);
    }
}