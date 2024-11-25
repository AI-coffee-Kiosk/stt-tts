package com.example.mykiosk.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping({ "", "/" })
    public String index(Model model) {
        return "html/index";
    }

    @GetMapping("main")
    public String main(Model model) {
        return "html/main";
    }

    @GetMapping("order")
    public String order(Model model) {
        return "html/order_1";
    }
}