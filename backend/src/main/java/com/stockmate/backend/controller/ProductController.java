package com.stockmate.backend.controller;

import com.stockmate.backend.entity.Product;
import com.stockmate.backend.entity.User;
import com.stockmate.backend.repository.ProductRepository;
import com.stockmate.backend.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
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

    private User getUserByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("User email is required");
        }

        return userRepository.findByEmail(
                email.trim().toLowerCase()
        ).orElseThrow(() ->
                new RuntimeException("User not found")
        );
    }

    @GetMapping
    public List<Product> getAllProducts(
            @RequestHeader("X-User-Email") String email
    ) {
        User user = getUserByEmail(email);

        return productRepository.findByUser(user);
    }

    @GetMapping("/{id}")
    public Product getProductById(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String email
    ) {
        User user = getUserByEmail(email);

        return productRepository.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"
                        )
                );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product addProduct(
            @Valid @RequestBody Product product,
            @RequestHeader("X-User-Email") String email
    ) {
        User user = getUserByEmail(email);

        product.setId(null);
        product.setUser(user);

        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody Product updatedProduct,
            @RequestHeader("X-User-Email") String email
    ) {
        User user = getUserByEmail(email);

        Product existingProduct =
                productRepository.findByIdAndUser(id, user)
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

        return productRepository.save(existingProduct);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String email
    ) {
        User user = getUserByEmail(email);

        Product product =
                productRepository.findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                )
                        );

        productRepository.delete(product);

        return "Product deleted successfully";
    }
}