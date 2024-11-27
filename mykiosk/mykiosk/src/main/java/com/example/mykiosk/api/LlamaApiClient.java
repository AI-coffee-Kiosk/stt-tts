package com.example.mykiosk.api;

import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

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
    public static String sendToPythonApi(String inputText, String llama_url) throws Exception {
        // API URL 설정
        //URL url = new URL("http://localhost:8000/order_input/");
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
            return response.toString();
        }


    }

    public static void main(String[] args) {
        try {
            // 테스트로 보낼 텍스트
            String inputText = "User STT input";
            //String outputText = sendToPythonApi(inputText, "http://localhost:8000/order_input/"); // 메서드 호출
            //System.out.println("Answer : " + outputText);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}