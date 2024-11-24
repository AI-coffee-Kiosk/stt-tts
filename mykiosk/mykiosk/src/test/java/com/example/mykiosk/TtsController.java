package com.example.mykiosk;

import com.example.mykiosk.util.TtsApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/speech")
public class TtsController {

    @Autowired
    private TtsApi tts;

    @PostMapping("/tts")
    public String convertTextToSpeech(@RequestParam String text) {
        return tts.synthesizeText(text);
    }
}
