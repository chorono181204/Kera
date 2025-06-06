package com.project.server.configuration;

import java.text.ParseException;
import java.util.Objects;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.JOSEException;
import com.project.server.dto.request.IntrospectRequest;
import com.project.server.service.AuthenticationService;

@Component
public class CustomJwtDecoder implements JwtDecoder {
    @Value("${jwt.signerKey}")
    private String signerKey;

    private final AuthenticationService authenticationService;
    private NimbusJwtDecoder nimbusJwtDecoder;

    public CustomJwtDecoder(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Override
    public Jwt decode(String token) {
        // 1. Introspect token qua service của bạn
        try {
            var response = authenticationService.introspect(
                    IntrospectRequest.builder().token(token).build());
            if (!response.isValid()) {
                // bắn BadCredentialsException để Spring hiểu là 401
                throw new BadCredentialsException("Token không hợp lệ");
            }
        } catch (JOSEException | ParseException e) {
            throw new BadCredentialsException("Lỗi khi phân tích token: " + e.getMessage(), e);
        }

        // 2. Build decoder nếu lần đầu
        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec key = new SecretKeySpec(signerKey.getBytes(), "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(key)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }

        // 3. Decode chính thức (cũng có thể ném JwtException nếu quá hạn, claim sai,…)
        try {
            return nimbusJwtDecoder.decode(token);
        } catch (Exception ex) {
            // quy về BadCredentialsException để entry point trả 401
            throw new BadCredentialsException("Token không thể giải mã", ex);
        }
    }

    public String getUsernameFromToken(String token) {
        Jwt jwt = decode(token);
        return jwt.getClaimAsString("sub"); // hoặc claim khác tùy vào JWT của bạn
    }
}
