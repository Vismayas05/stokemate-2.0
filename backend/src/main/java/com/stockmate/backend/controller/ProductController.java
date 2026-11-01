package com.stockmate.backend.controller;

import com.stockmate.backend.entity.Product;
import com.stockmate.backend.entity.User;
import com.stockmate.backend.repository.ProductRepository;
import com.stockmate.backend.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductController(
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // --------------------------------------------------
    // GET AUTHENTICATED USER
    // --------------------------------------------------

    private User getAuthenticatedUser(
            Authentication authentication
    ) {
        if (authentication == null
                || !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        String email =
                authentication.getName();

        if (email == null
                || email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Authenticated user email is missing"
            );
        }

        return userRepository.findByEmail(
                email.trim().toLowerCase()
        ).orElseThrow(() ->
                new RuntimeException(
                        "User not found"
                )
        );
    }

    // --------------------------------------------------
    // GET ALL PRODUCTS
    // --------------------------------------------------

    @GetMapping
    public List<Product> getAllProducts(
            Authentication authentication
    ) {
        User user =
                getAuthenticatedUser(authentication);

        return productRepository.findByUser(user);
    }

    // --------------------------------------------------
    // GET PRODUCT BY ID
    // --------------------------------------------------

    @GetMapping("/{id}")
    public Product getProductById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user =
                getAuthenticatedUser(authentication);

        return productRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"
                        )
                );
    }

    // --------------------------------------------------
    // ADD PRODUCT
    // --------------------------------------------------

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product addProduct(
            @Valid @RequestBody Product product,
            Authentication authentication
    ) {
        User user =
                getAuthenticatedUser(authentication);

        // Never trust an ID sent from frontend
        product.setId(null);

        // Always associate product with
        // the authenticated user
        product.setUser(user);

        return productRepository.save(product);
    }

    // --------------------------------------------------
    // UPDATE PRODUCT
    // --------------------------------------------------

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody Product updatedProduct,
            Authentication authentication
    ) {
        User user =
                getAuthenticatedUser(authentication);

        Product existingProduct =
                productRepository
                        .findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                )
                        );

        existingProduct.setName(
                updatedProduct.getName()
        );

        existingProduct.setCategory(
                updatedProduct.getCategory()
        );

        existingProduct.setSupplier(
                updatedProduct.getSupplier()
        );

        existingProduct.setPrice(
                updatedProduct.getPrice()
        );

        existingProduct.setQuantity(
                updatedProduct.getQuantity()
        );

        existingProduct.setExpiryDate(
                updatedProduct.getExpiryDate()
        );

        return productRepository.save(
                existingProduct
        );
    }

    // --------------------------------------------------
    // DELETE PRODUCT
    // --------------------------------------------------

    @DeleteMapping("/{id}")
    public String deleteProduct(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user =
                getAuthenticatedUser(authentication);

        Product product =
                productRepository
                        .findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                )
                        );

        productRepository.delete(product);

        return "Product deleted successfully";
    }
}