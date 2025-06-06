package com.project.server.configuration;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudinaryConfiguration {
    @Bean
    public Cloudinary configKey() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dmhdv1ykp");
        config.put("api_key", "345613951591434");
        config.put("api_secret", "CKMLH649SlqfC378-efHD7H7IYE");
        return new Cloudinary(config);
    }
}
