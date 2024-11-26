package com.example.mykiosk.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    //대기화면
    @GetMapping({ "", "/" })
    public String index(Model model) {
        return "html/index";
    }

    //main 화면
    @GetMapping("main")
    public String main(Model model) {

        return "html/main";
    }

    //결제창
    @GetMapping("pay")
    public String pay(Model model) {
        return "html/pay_info";
    }

    //영수증 및 주문번호
    @GetMapping("rcpt")
    public String receipt(Model model) {
        return "html/receipt_up";
    }

    //포장여부
    @GetMapping("togo")
    public String togo(Model model) {
        return "html/shop_out_up";
    }

    @GetMapping("order")
    public String order(Model model) {
        return "html/order_1";
    }
    @GetMapping("orderall")
    public String orderall(Model model) {
        return "html/order_2";
    }
}