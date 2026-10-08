package com.stockmate.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(
            String email,
            String name,
            String token
    ) {

        String resetLink =
                frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("Reset your StockMate password");

        message.setText(
                "Hi " + name + ",\n\n" +

                "We received a request to reset your StockMate password.\n\n" +

                "Use the link below to create a new password:\n\n" +

                resetLink + "\n\n" +

                "This link expires in 15 minutes and can only be used once.\n\n" +

                "If you did not request this, you can safely ignore this email.\n\n" +

                "StockMate Team"
        );

        mailSender.send(message);
    }
}