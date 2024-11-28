package com.example.mykiosk.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequestMapping("/order")
public class OrderController {
    @GetMapping("1")
    public String order(Model model) {
        return "html/order_1";
    }

    @GetMapping("/all")
    public String orderAll(Model model) {
        return "html/order_2";
    }
}
