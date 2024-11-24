package com.example.demo.controller;

import com.example.mykiosk.util.tts_api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/speech")
public class StsController {

    @Autowired
    private TtsApi tts;

    @PostMapping("/tts")
    public String convertTextToSpeech(@RequestParam String text) {
        return tts.synthesizeText(text);
    }
}
