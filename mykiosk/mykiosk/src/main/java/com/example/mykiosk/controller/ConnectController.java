package com.example.mykiosk.controller;

import com.example.mykiosk.api.LlamaApiClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chatBot")
public class ConnectController {
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> message) {
        String llamaUrl = "http://localhost:8000/order_input/";
        String userMessage = message.get("message");

        /*try {
            // Llama API 호출
            response = LlamaApiClient.sendToPythonApi(userMessage, llamaUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // 예외 처리
            response.put("error", "Failed to process the request: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }*/
        Map<String, Object> response = new HashMap<>();
        response.put("current_orders", Map.of(
                "drinks", List.of(
                        Map.of(
                                "name", "아메리카노",
                                "size", "미디움",
                                "temperature", "핫",
                                "add_ons", "None",
                                "quantity_indexes", List.of("0-0", "0-1"),
                                "quantity", 2
                        ),
                        Map.of(
                                "name", "아메리카노",
                                "size", "미디움",
                                "temperature", "아이스",
                                "add_ons", "None",
                                "quantity_indexes", List.of("1-0"),
                                "quantity", 1
                        ),
                        Map.of(
                                "name", "카페라떼",
                                "size", "라지",
                                "temperature", "아이스",
                                "add_ons", "(샷 추가: 1)",
                                "quantity_indexes", List.of("2-0"),
                                "quantity", 1
                        )
                )
        ));

        // text 필드 추가
        response.put("text", userMessage + " 주문되었습니다.");
        return ResponseEntity.ok(response);
    }
}
