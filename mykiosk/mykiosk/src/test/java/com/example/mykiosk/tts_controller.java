package com.example.demo.controller;

import com.example.demo.service.TextToSpeechService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tts")
public class TextToSpeechController {

    @Autowired
    private TextToSpeechService textToSpeechService;

    @PostMapping
    public String convertTextToSpeech(@RequestParam String text) {
        return textToSpeechService.synthesizeText(text);
    }
}
