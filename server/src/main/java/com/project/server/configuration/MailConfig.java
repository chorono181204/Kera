package com.project.server.configuration;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class MailConfig {

    // Đọc các giá trị từ application.yml
    @Value("${spring.mail.host}")
    private String mailHost;

    @Value("${spring.mail.port}")
    private int mailPort;

    @Value("${spring.mail.username}")
    private String mailUsername;

    @Value("${spring.mail.password}")
    private String mailPassword;

    @Value("${spring.mail.properties.mail.smtp.auth}")
    private boolean mailSmtpAuth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable}")
    private boolean mailStarttlsEnable;

    @Value("${spring.mail.properties.mail.smtp.starttls.required}")
    private boolean mailStarttlsRequired;

    // log config infor

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        // Thiết lập host, port, username, password
        mailSender.setHost(mailHost);
        mailSender.setPort(mailPort);
        mailSender.setUsername(mailUsername);
        mailSender.setPassword(mailPassword);
        log.info("Mail configuration: host={}, port={}, username={}", mailHost, mailPort, mailUsername);
        // Thiết lập mặc định charset (UTF-8)
        mailSender.setDefaultEncoding("UTF-8");

        // Cấu hình thêm các thuộc tính SMTP
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", mailSmtpAuth);
        props.put("mail.smtp.starttls.enable", mailStarttlsEnable);
        props.put("mail.smtp.starttls.required", mailStarttlsRequired);

        // Nếu muốn bật debug để log chi tiết quá trình gửi mail, thêm dòng sau:
        props.put("mail.debug", "true");

        return mailSender;
    }
}
