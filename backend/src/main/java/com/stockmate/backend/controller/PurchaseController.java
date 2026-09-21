
package com.stockmate.backend.controller;

import com.stockmate.backend.entity.Product;
import com.stockmate.backend.entity.Purchase;
import com.stockmate.backend.repository.ProductRepository;
import com.stockmate.backend.repository.PurchaseRepository;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "http://localhost:5173")
public class PurchaseController {

    private final PurchaseRepository purchaseRepository;
    private final ProductRepository productRepository;

    public PurchaseController(
            PurchaseRepository purchaseRepository,
            ProductRepository productRepository) {

        this.purchaseRepository = purchaseRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Purchase addPurchase(@Valid @RequestBody Purchase purchase) {

        Product product = productRepository.findById(
                purchase.getProduct().getId()
        ).orElseThrow(() -> new RuntimeException("Product not found"));

        int currentQuantity = product.getQuantity() == null
                ? 0
                : product.getQuantity();

        product.setQuantity(currentQuantity + purchase.getQuantity());

        productRepository.save(product);

        purchase.setProduct(product);

        return purchaseRepository.save(purchase);
    }

    @DeleteMapping("/{id}")
    public String deletePurchase(@PathVariable Long id) {

        purchaseRepository.deleteById(id);

        return "Purchase deleted successfully";
    }
}