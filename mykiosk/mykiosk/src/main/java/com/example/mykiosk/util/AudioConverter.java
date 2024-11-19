package com.example.mykiosk.util;

import javax.sound.sampled.*;
import java.io.IOException;

public class AudioConverter {

    // AudioInputStream을 변환하는 메서드
    public static AudioInputStream convertSampleRateAndChannels(AudioInputStream inputAudioStream, float targetSampleRate, int targetChannels) throws UnsupportedAudioFileException, IOException {
        AudioFormat baseFormat = inputAudioStream.getFormat();
        AudioFormat targetFormat = new AudioFormat(
                baseFormat.getEncoding(),
                targetSampleRate,
                baseFormat.getSampleSizeInBits(),
                targetChannels,
                targetChannels * baseFormat.getSampleSizeInBits() / 8,
                targetSampleRate,
                baseFormat.isBigEndian()
        );

        // Convert the audio
        return AudioSystem.getAudioInputStream(targetFormat, inputAudioStream);
    }
}
