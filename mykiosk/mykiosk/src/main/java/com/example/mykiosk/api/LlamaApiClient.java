package com.example.mykiosk.api;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

// 사용법
/*
package com.sample.www.controller;

import com.sample.www.controller.api.ApiClient; // ApiClient 클래스 임포트

public class TestApiClient {
    public static void main(String[] args) {
        try {
            String inputText = "STT 결과물";
            String outputText = sendToPythonApi(inputText, "http://localhost:8000/order_input/"); // 메서드 호출
            System.out.println("Answer : " + outputText);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
 */
public class LlamaApiClient {
    public static Map<String, Object> sendToPythonApi(String inputText, String llama_url) throws Exception {
        // API URL 설정
        URL url = new URL(llama_url);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        // JSON 데이터 전송
        String jsonInput = "{\"text\": \"" + inputText + "\"}";
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = jsonInput.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        // 응답 수신
        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> info = mapper.readValue(response.toString(), Map.class);
            for (Map.Entry<String, Object> entry : info.entrySet()) {
                System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue() + "Value Type: " + entry.getValue().getClass().getName());
            }

            for (Map.Entry<String, Object> entry : info.entrySet()) {

                // current_item이 JSON 문자열인 경우 파싱
                if (entry.getKey().equals("current_orders")) {
                    String jsonString = (String) entry.getValue();
                    Map<String, Object> parsedJson = mapper.readValue(jsonString, Map.class);
                    entry.setValue(parsedJson); // JSON 문자열을 Map으로 변환하여 다시 저장
                }
                System.out.println("Key: " + entry.getKey());
                System.out.println("Value: " + entry.getValue());
                System.out.println("Value Type: " + entry.getValue().getClass().getName());
            }


            return info;


        }
    }
}
