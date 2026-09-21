
package com.stockmate.backend.controller;

import com.stockmate.backend.entity.Product;
import com.stockmate.backend.entity.Sale;
import com.stockmate.backend.repository.ProductRepository;
import com.stockmate.backend.repository.SaleRepository;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:5173")
public class SaleController {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;

    public SaleController(
            SaleRepository saleRepository,
            ProductRepository productRepository) {

        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Sale addSale(@Valid @RequestBody Sale sale) {

        Product product = productRepository.findById(
                sale.getProduct().getId()
        ).orElseThrow(() -> new RuntimeException("Product not found"));

        int currentQuantity = product.getQuantity() == null
                ? 0
                : product.getQuantity();

        if (currentQuantity < sale.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        product.setQuantity(currentQuantity - sale.getQuantity());

        productRepository.save(product);

        sale.setProduct(product);

        return saleRepository.save(sale);
    }

    @DeleteMapping("/{id}")
    public String deleteSale(@PathVariable Long id) {

        saleRepository.deleteById(id);

        return "Sale deleted successfully";
    }
}