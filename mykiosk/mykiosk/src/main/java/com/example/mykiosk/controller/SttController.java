package com.example.mykiosk.controller;

import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.example.mykiosk.util.AudioConverter;

import javax.sound.sampled.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
//
@RestController
@RequestMapping("/api/speech")
public class SttController {
    @PostMapping("/stt")
    public ResponseEntity<?> recognizeSpeech(@RequestParam("file") MultipartFile audioFile) {
        if (audioFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Audio file is required.");
        }

        try {
            // Save the uploaded file temporarily
            File tempFile = File.createTempFile("audio", ".wav");
            audioFile.transferTo(tempFile);

            // Convert the audio file to mono and 16kHz sample rate if necessary
            // Convert File to AudioInputStream first
            AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(tempFile);
            audioInputStream = AudioConverter.convertSampleRateAndChannels(audioInputStream, 16000, 1); // Convert to mono and 16kHz

            // Convert the AudioInputStream back to File
            File convertedFile = File.createTempFile("converted_", ".wav");
            AudioSystem.write(audioInputStream, AudioFileFormat.Type.WAVE, convertedFile);

            // Convert the converted file to ByteString
            ByteString audioBytes = ByteString.copyFrom(Files.readAllBytes(convertedFile.toPath()));

            // Configure the request with the correct sample rate (16000 Hz)
            RecognitionConfig config = RecognitionConfig.newBuilder()
                    .setEncoding(RecognitionConfig.AudioEncoding.LINEAR16)
                    .setSampleRateHertz(16000) // Ensure 16000 Hz sample rate
                    .setLanguageCode("ko-KR")
                    .build();

            RecognitionAudio audio = RecognitionAudio.newBuilder()
                    .setContent(audioBytes)
                    .build();

            // Send request to Speech-to-Text API
            try (SpeechClient speechClient = SpeechClient.create()) {
                RecognizeResponse response = speechClient.recognize(config, audio);
                StringBuilder transcript = new StringBuilder();

                for (SpeechRecognitionResult result : response.getResultsList()) {
                    SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
                    transcript.append(alternative.getTranscript());
                }
                System.out.println(transcript.toString());
                // Return the recognized text
                return ResponseEntity.ok().body(transcript.toString());
            }

        } catch (IOException | UnsupportedAudioFileException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error processing the audio file: " + e.getMessage());
        }
    }
}
