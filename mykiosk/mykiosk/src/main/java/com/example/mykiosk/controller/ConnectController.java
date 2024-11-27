package com.example.mykiosk.controller;

import com.example.mykiosk.api.LlamaApiClient;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/chatBot")
public class ConnectController {
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> message) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        String llamaUrl = "https://92ba-34-143-134-120.ngrok-free.app/process_text/";
        String userMessage = message.get("message");
        String response = "{\"action\" : \"complete\", \"text\": \"아메리카노가 추가되었습니다.\\n현재 주문하신 내용은 다음과 같습니다:\\n아이스 아메리카노 라지 2잔\", \"current_orders\": {\"drinks\": [{\"index\": 0, \"name\": \"아메리카노\", \"size\": \"라지\", \"temperature\": \"아이스\", \"add_ons\": \"None\", \"quantity\": 2, \"quantity_indexes\": [\"0-0\", \"0-1\"]}]}}";


        Map<String, Object> info = mapper.readValue(response, Map.class);
        return ResponseEntity.ok(info);

        /*
        try {
            // Llama API 호출
            Map<String, Object> info = mapper.readValue(LlamaApiClient.sendToPythonApi(userMessage, llamaUrl), Map.class);
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            // 예외 처리
            response.put("error", "Failed to process the request: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }*/
    }
}
