package com.example.mykiosk.controller;

import com.example.mykiosk.api.LlamaApiClient;
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
        Map<String, String> response = new HashMap<>();
        String llamaUrl = "http://localhost:8000/order_input/";
        String userMessage = message.get("message");

        /*try {
            // Llama API 호출
            String llamaMessage = LlamaApiClient.sendToPythonApi(userMessage, llamaUrl);
            response.put("text", llamaMessage);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // 예외 처리
            response.put("error", "Failed to process the request: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }*/
        response.put("text", message.get("message"));//들어온 input 그대로 출력
        return ResponseEntity.ok(response);
    }
}
