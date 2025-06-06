package com.project.server.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final String apiPrefix = "/api/v1";

    private final String[] PUBLIC_ENDPOINTS = {
        apiPrefix + "/auth/login",
        apiPrefix + "/auth/register",
        apiPrefix + "/auth/refresh",
        apiPrefix + "/auth/logout",
        apiPrefix + "/auth/introspect",
        apiPrefix + "/auth/verify-account",
        apiPrefix + "/users/**",
        apiPrefix + "/cards/**",
        apiPrefix + "/boards/**",
        apiPrefix + "/columns/**",
        // cho SockJS polling (/ws/info, /ws/websocket/**, …)
        "/ws/**",
        "/ws**",
        "/error"
    };

    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Tắt CSRF vì chúng ta dùng JWT và SockJS
                .csrf(AbstractHttpConfigurer::disable)
                // Bật CORS mặc định (Config bên ngoài nếu cần)
                .cors(Customizer.withDefaults())
                // Phân quyền
                .authorizeHttpRequests(auth -> auth
                        // Cho phép preflight CORS
                        .requestMatchers(HttpMethod.OPTIONS, "/**")
                        .permitAll()
                        // Cho phép public endpoints
                        .requestMatchers(PUBLIC_ENDPOINTS)
                        .permitAll()
                        // Còn lại bắt auth
                        .anyRequest()
                        .authenticated())
                // Cấu hình OAuth2 Resource Server với JWT
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt ->
                                jwt.decoder(customJwtDecoder).jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .authenticationEntryPoint(new JwtAuthenticationEntryPoint()));

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthorityPrefix(""); // bỏ prefix "ROLE_"
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        return converter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
