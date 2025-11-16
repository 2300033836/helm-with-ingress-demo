package com.klef.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to Budget Tracker Application ";
    }

    @GetMapping("/api/info")
    public String info() {
        return "Spring Boot Budget Tracker API is running! ";
    }
}
