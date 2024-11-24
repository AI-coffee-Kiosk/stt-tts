package com.example.mykiosk.util;

import com.google.cloud.texttospeech.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class TtsApi {

    public String synthesizeText(String text) {
        try (TextToSpeechClient textToSpeechClient = TextToSpeechClient.create()) {
            // 요청 생성
            SynthesisInput input = SynthesisInput.newBuilder()
                    .setText(text)
                    .build();

            // 음성 설정
            VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
                    .setLanguageCode("ko-KR")
                    .setSsmlGender(SsmlVoiceGender.NEUTRAL)
                    .build();

            // 출력 형식 설정
            AudioConfig audioConfig = AudioConfig.newBuilder()
                    .setAudioEncoding(AudioEncoding.MP3)
                    .build();

            // API 호출
            SynthesizeSpeechResponse response = textToSpeechClient.synthesizeSpeech(input, voice, audioConfig);

            // 오디오 파일 저장
            ByteString audioContents = response.getAudioContent();
            String outputFilePath = "output.mp3";
            try (FileOutputStream out = new FileOutputStream(outputFilePath)) {
                out.write(audioContents.toByteArray());
            }

            return "Audio content written to file: " + outputFilePath;

        } catch (IOException e) {
            e.printStackTrace();
            return "Error occurred: " + e.getMessage();
        }
    }
}
