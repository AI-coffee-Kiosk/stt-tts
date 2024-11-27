package com.example.mykiosk.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequestMapping("/pay")
public class PaymentController {
    @GetMapping("")
    public String pay(Model model) {
        return "html/pay_info";
    }

    @GetMapping("/receipt")
    public String receipt(Model model) {
        return "html/receipt_up";
    }

    @GetMapping("/togo")
    public String togo(Model model) {
        return "html/shop_out_up";
    }
}