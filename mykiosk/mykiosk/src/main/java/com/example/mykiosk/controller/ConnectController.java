package com.example.mykiosk.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chatBot")
public class ConnectController {
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> message) {
        // llama api post(message.get("message"))
        // llama api get and 데이터 수정
        Map<String, String> response = new HashMap<>();
        String userMessage = message.get("message");
        response.put("text", userMessage);
        return ResponseEntity.ok(response);//llama response return
    }

}
