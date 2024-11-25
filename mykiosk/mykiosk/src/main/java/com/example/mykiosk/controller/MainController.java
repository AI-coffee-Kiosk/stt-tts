package com.example.mykiosk.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping({ "", "/" })
    public String Main(Model model) {

        return "html/index";
    }

    @GetMapping("main")
    public String main(Model model) {
        return "html/main";
    }

    @GetMapping("example")
    public String example(Model model) {
        return "html/shop_out_up";
    }
}