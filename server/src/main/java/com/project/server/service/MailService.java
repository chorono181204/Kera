package com.project.server.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MailService {
    JavaMailSender mailSender;
    // Add methods to send emails, e.g., sendVerificationEmail, sendPasswordResetEmail, etc.
    // Example method to send a simple email
    public void sendVerificationEmail(String username, String token) {
        String subject = "Email Verification";
        String verifyUrl = "http://localhost:5173/verify?token=" + token;

        // Nội dung email bằng tiếng Anh, có thẻ <a> để click
        String content = "<p>Hello,</p>"
                + "<p>Please verify your email by clicking the link below:</p>"
                + "<p><a href=\"" + verifyUrl + "\">Verify your email address</a></p>"
                + "<br>"
                + "<p>If you did not request this, please ignore this email.</p>";

        try {
            var message = mailSender.createMimeMessage();
            var helper = new org.springframework.mail.javamail.MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("caitovu.dev@gmail.com");
            helper.setTo(username);
            helper.setSubject(subject);
            helper.setText(content, true); // true = gửi HTML
            mailSender.send(message);
            log.info("Verification email sent to {}", username);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}", username, e);
        }
    }
}
