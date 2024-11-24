package com.example.mykiosk.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
public class ConnectController {
    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> message) {

        System.out.println(message.get("message"));
        return "";
    }

}
