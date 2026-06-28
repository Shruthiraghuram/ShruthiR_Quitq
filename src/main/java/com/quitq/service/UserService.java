package com.quitq.service;
import com.quitq.exception.ResourceNotFoundException;
import com.quitq.dto.UserDTO;
import com.quitq.model.User;
import com.quitq.repository.UserRepository;
import com.quitq.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class UserService {
	@Autowired
	private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    private UserDTO convertToDTO(User user) {
        if (user == null) {
            return null;
        }
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
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));
    }

    public UserDTO registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    
 
    public Map<String, String> loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            String token = jwtUtil.generateToken(email, user.get().getRole());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.get().getRole());
            response.put("email", email);
            return response;
        }
        throw new RuntimeException("Invalid email or password!");
    }

   
    public UserDTO getUserById(int userId) {
        return convertToDTO(findUserById(userId));
    }

   
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

   
    public UserDTO updateUser(int userId, User updatedUser) {
        User existingUser = findUserById(userId);
        existingUser.setName(updatedUser.getName());
        existingUser.setContactNumber(updatedUser.getContactNumber());
        existingUser.setAddress(updatedUser.getAddress());
        existingUser.setGender(updatedUser.getGender());
        User savedUser = userRepository.save(existingUser);
        return convertToDTO(savedUser);
    }

   
    public void deleteUser(int userId) {
        findUserById(userId);
        userRepository.deleteById(userId);
    }
}