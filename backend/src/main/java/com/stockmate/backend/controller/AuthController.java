package com.stockmate.backend.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import com.stockmate.backend.dto.LoginRequest;
import com.stockmate.backend.dto.SignupRequest;
import com.stockmate.backend.entity.PasswordResetToken;
import com.stockmate.backend.entity.User;
import com.stockmate.backend.repository.PasswordResetTokenRepository;
import com.stockmate.backend.repository.ProductRepository;
import com.stockmate.backend.repository.UserRepository;
import com.stockmate.backend.security.JwtService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://stokemate-2-0.onrender.com"
})
public class AuthController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;

    @Value("${google.client-id}")
    private String googleClientId;

    public AuthController(
            UserRepository userRepository,
            ProductRepository productRepository,
            PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }

    // -------------------------
    // SIGNUP
    // -------------------------

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

    // -------------------------
    // LOGIN
    // -------------------------

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

        return createLoginResponse(user);
    }

    // -------------------------
    // GOOGLE LOGIN
    // -------------------------

    @PostMapping("/google")
    public Map<String, String> googleLogin(
            @RequestBody Map<String, String> request
    ) {

        String credential = request.get("credential");

        if (credential == null || credential.isBlank()) {
            throw new RuntimeException(
                    "Google credential is required"
            );
        }

        try {

            GoogleIdTokenVerifier verifier =
                    new GoogleIdTokenVerifier.Builder(
                            new NetHttpTransport(),
                            GsonFactory.getDefaultInstance()
                    )
                            .setAudience(
                                    Collections.singletonList(
                                            googleClientId
                                    )
                            )
                            .build();

            GoogleIdToken idToken =
                    verifier.verify(credential);

            if (idToken == null) {
                throw new RuntimeException(
                        "Invalid Google credential"
                );
            }

            GoogleIdToken.Payload payload =
                    idToken.getPayload();

            String email = payload.getEmail()
                    .trim()
                    .toLowerCase();

            String name = payload.get("name") != null
                    ? payload.get("name").toString()
                    : email.split("@")[0];

            User user =
                    userRepository.findByEmail(email)
                            .orElseGet(() -> {

                                User newUser = new User();

                                newUser.setName(name);
                                newUser.setEmail(email);

                                /*
                                 * Google users don't need
                                 * a local password initially.
                                 */
                                newUser.setPassword(
                                        passwordEncoder.encode(
                                                UUID.randomUUID().toString()
                                        )
                                );

                                return userRepository.save(newUser);
                            });

            return createLoginResponse(user);

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Google authentication failed"
            );
        }
    }

    // -------------------------
    // FORGOT PASSWORD
    // -------------------------

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(
            @RequestBody Map<String, String> request
    ) {

        String email = request.get("email");

        if (email == null || email.isBlank()) {
            throw new RuntimeException(
                    "Email is required"
            );
        }

        String normalizedEmail =
                email.trim().toLowerCase();

        /*
         * Don't reveal whether an account exists.
         */

        userRepository.findByEmail(normalizedEmail)
                .ifPresent(user -> {

                    // Remove previous reset tokens
                    tokenRepository.deleteByUser(user);

                    PasswordResetToken resetToken =
                            new PasswordResetToken();

                    resetToken.setToken(
                            UUID.randomUUID().toString()
                    );

                    resetToken.setUser(user);

                    resetToken.setExpiresAt(
                            LocalDateTime.now()
                                    .plusMinutes(15)
                    );

                    resetToken.setUsed(false);

                    tokenRepository.save(resetToken);

                    emailService.sendPasswordResetEmail(
                            user.getEmail(),
                            user.getName(),
                            resetToken.getToken()
                    );
                });

        return Map.of(
                "message",
                "If an account exists for that email, a reset link has been sent."
        );
    }

    // -------------------------
    // RESET PASSWORD
    // -------------------------

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(
            @RequestBody Map<String, String> request
    ) {

        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || token.isBlank()) {
            throw new RuntimeException(
                    "Reset token is required"
            );
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException(
                    "Password must contain at least 6 characters"
            );
        }

        PasswordResetToken resetToken =
                tokenRepository.findByToken(token)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid or expired reset link"
                                )
                        );

        if (resetToken.isUsed()) {
            throw new RuntimeException(
                    "This reset link has already been used"
            );
        }

        if (resetToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "This reset link has expired"
            );
        }

        User user = resetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        return Map.of(
                "message",
                "Password reset successfully"
        );
    }

    // -------------------------
    // DELETE ACCOUNT
    // -------------------------

    @Transactional
    @DeleteMapping("/delete-account")
    public Map<String, String> deleteAccount(
            @RequestHeader("X-User-Email") String email
    ) {

        String normalizedEmail =
                email.trim().toLowerCase();

        User user =
                userRepository.findByEmail(normalizedEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        productRepository.deleteByUser(user);

        tokenRepository.deleteByUser(user);

        userRepository.delete(user);

        return Map.of(
                "message",
                "Account deleted successfully"
        );
    }

    // -------------------------
    // LOGIN RESPONSE
    // -------------------------

    private Map<String, String> createLoginResponse(
            User user
    ) {

        String token =
                jwtService.generateToken(user.getEmail());

        return Map.of(
                "message", "Login successful",
                "token", token,
                "id", String.valueOf(user.getId()),
                "name", user.getName(),
                "email", user.getEmail()
        );
    }
}