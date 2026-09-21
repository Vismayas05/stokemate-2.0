package com.stockmate.backend.repository;

import com.stockmate.backend.entity.Product;
import com.stockmate.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByUser(User user);

    Optional<Product> findByIdAndUser(Long id, User user);

    void deleteByUser(User user);
}