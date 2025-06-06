package com.project.server.controller;

import java.text.ParseException;

import org.springframework.web.bind.annotation.*;

import com.nimbusds.jose.JOSEException;
import com.project.server.dto.request.*;
import com.project.server.dto.response.ApiResponse;
import com.project.server.dto.response.AuthenticationResponse;
import com.project.server.dto.response.IntrospectResponse;
import com.project.server.dto.response.UserResponse;
import com.project.server.service.AuthenticationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("${api.prefix}/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/register")
    ApiResponse<UserResponse> register(@RequestBody UserCreationRequest request) {
        var result = authenticationService.register(request);
        return ApiResponse.<UserResponse>builder().result(result).build();
    }

    @PostMapping("/verify-account")
    ApiResponse<Void> verifyAccount(@RequestBody String token) throws ParseException, JOSEException {
        authenticationService.activateUser(token);
        return ApiResponse.<Void>builder().build();
    }
}
