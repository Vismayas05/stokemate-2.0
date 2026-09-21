package com.stockmate.backend.controller;

import com.stockmate.backend.dto.LoginRequest;
import com.stockmate.backend.dto.SignupRequest;
import com.stockmate.backend.entity.User;
import com.stockmate.backend.repository.ProductRepository;
import com.stockmate.backend.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> signup(
            @Valid @RequestBody SignupRequest request
    ) {
        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        userRepository.save(user);

        return Map.of(
                "message", "Signup successful"
        );
    }

    @PostMapping("/login")
    public Map<String, String> login(
            @Valid @RequestBody LoginRequest request
    ) {
        String email = request.getEmail()
                .trim()
                .toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        return Map.of(
                "message", "Login successful",
                "id", String.valueOf(user.getId()),
                "name", user.getName(),
                "email", user.getEmail()
        );
    }

    @PutMapping("/reset-password")
    public Map<String, String> resetPassword(
            @RequestBody Map<String, String> request
    ) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        if (email == null || newPassword == null) {
            throw new RuntimeException(
                    "Email and new password are required"
            );
        }

        if (newPassword.length() < 6) {
            throw new RuntimeException(
                    "Password must contain at least 6 characters"
            );
        }

        String normalizedEmail = email
                .trim()
                .toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);

        return Map.of(
                "message",
                "Password reset successfully"
        );
    }

    @Transactional
    @DeleteMapping("/delete-account")
    public Map<String, String> deleteAccount(
            @RequestHeader("X-User-Email") String email
    ) {
        String normalizedEmail = email
                .trim()
                .toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // Delete all products belonging to this user
        productRepository.deleteByUser(user);

        // Delete the user account
        userRepository.delete(user);

        return Map.of(
                "message",
                "Account deleted successfully"
        );
    }
}