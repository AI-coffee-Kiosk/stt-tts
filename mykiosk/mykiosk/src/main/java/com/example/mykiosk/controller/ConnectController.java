package com.example.mykiosk.controller;

import com.example.mykiosk.api.LlamaApiClient;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/chatBot")
public class ConnectController {
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> message) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        String llamaUrl = "https://acd3-35-232-80-109.ngrok-free.app/process_text/";
        String userMessage = message.get("message");

        /*String response = "{\"action\" : \"None\", \"text\": \"아메리카노가 추가되었습니다.\\n현재 주문하신 내용은 다음과 같습니다:\\n아이스 아메리카노 라지 2잔\", " +
                "\"current_orders\": {\"drinks\": [{\"index\": 0, \"name\": \"딸기스무디\", \"size\": \"라지\", \"temperature\": \"아이스\", \"add_ons\": \"(샷 추가: 1)\", \"quantity\": 2, \"quantity_indexes\": [\"0-0\", \"0-1\"]}]}}";


        Map<String, Object> info = mapper.readValue(response, Map.class);
        System.out.println(info);
        return ResponseEntity.ok(info);*/

        try {
            String llamaResponse = LlamaApiClient.sendToPythonApi(userMessage, llamaUrl);
            Map<String, Object> info = mapper.readValue(llamaResponse, Map.class);
            System.out.println("Llama API Response: " + info);
            return ResponseEntity.ok(info);

        } catch (JsonProcessingException e) {
            System.err.println("Error processing JSON response: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Invalid JSON response from Llama API"));
        } catch (Exception e) {
            System.err.println("Error calling Llama API: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Error communicating with Llama API"));
        }
    }
}
