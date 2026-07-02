package com.quitq.service;
import com.quitq.exception.ResourceNotFoundException;
import com.quitq.model.User;
import com.quitq.repository.UserRepository;
import com.quitq.security.JwtUtil;
import com.quitq.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    private UserDTO convertToDTO(User user) {
        if (user == null) return null;
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setGender(user.getGender());
        dto.setContactNumber(user.getContactNumber());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole());
        return dto;
    }

    private User findUserById(int userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", userId);
                    return new ResourceNotFoundException("User not found!");
                });
    }

    public UserDTO registerUser(User user) {
        logger.info("Registering new user with email: {}", user.getEmail());
        if (userRepository.existsByEmail(user.getEmail())) {
            logger.error("Email already exists: {}", user.getEmail());
            throw new RuntimeException("Email already exists!");
        }
        User savedUser = userRepository.save(user);
        logger.info("User registered successfully with ID: {}", savedUser.getUserId());
        return convertToDTO(savedUser);
    }

    public Map<String, String> loginUser(String email, String password) {
        logger.info("Login attempt for email: {}", email);
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            logger.info("Login successful for email: {}", email);
            String token = jwtUtil.generateToken(email, user.get().getRole());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.get().getRole());
            response.put("email", email);
            return response;
        }
        logger.error("Login failed for email: {}", email);
        throw new RuntimeException("Invalid email or password!");
    }

    public UserDTO getUserById(int userId) {
        logger.info("Fetching user with ID: {}", userId);
        return convertToDTO(findUserById(userId));
    }

    public List<UserDTO> getAllUsers() {
        logger.info("Fetching all users");
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO updateUser(int userId, User updatedUser) {
        logger.info("Updating user with ID: {}", userId);
        User existingUser = findUserById(userId);
        existingUser.setName(updatedUser.getName());
        existingUser.setContactNumber(updatedUser.getContactNumber());
        existingUser.setAddress(updatedUser.getAddress());
        existingUser.setGender(updatedUser.getGender());
        User savedUser = userRepository.save(existingUser);
        logger.info("User updated successfully with ID: {}", userId);
        return convertToDTO(savedUser);
    }

    public void deleteUser(int userId) {
        logger.info("Deleting user with ID: {}", userId);
        findUserById(userId);
        userRepository.deleteById(userId);
        logger.info("User deleted successfully with ID: {}", userId);
    }
}