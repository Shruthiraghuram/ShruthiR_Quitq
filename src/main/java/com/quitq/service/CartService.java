package com.quitq.service;
import com.quitq.exception.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

   
    public Cart getOrCreateCart(int userId) {
        Optional<Cart> cart = cartRepository.findByUserUserId(userId);
        if (cart.isPresent()) {
            return cart.get();
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        Cart newCart = new Cart();
        newCart.setUser(user);
        return cartRepository.save(newCart);
    }

  
    public CartItem addItemToCart(int userId, int productId, int quantity) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found!"));

       
        Optional<CartItem> existingItem = cartItemRepository
                .findByCartCartIdAndProductProductId(cart.getCartId(), productId);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        }

        CartItem newItem = new CartItem();
        newItem.setCart(cart);
        newItem.setProduct(product);
        newItem.setQuantity(quantity);
        return cartItemRepository.save(newItem);
    }

    
    public List<CartItem> getCartItems(int userId) {
        Cart cart = getOrCreateCart(userId);
        return cartItemRepository.findByCartCartId(cart.getCartId());
    }

   
    public CartItem updateCartItem(int cartItemId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found!"));
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

   
    public void removeItemFromCart(int cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(int userId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCartCartId(cart.getCartId());
    }
}