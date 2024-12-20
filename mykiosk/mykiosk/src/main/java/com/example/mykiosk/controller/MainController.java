package com.example.mykiosk.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequestMapping("/")
public class MainController {
    @GetMapping("")
    public String index(Model model) {
        return "html/index";
    }

    @GetMapping("main")
    public String main(Model model) {
        return "html/main";
    }
}