import wave
import struct
import math
import random

sample_rate = 44100
duration = 7.5
num_samples = int(sample_rate * duration)

audio = [0.0] * num_samples

def add_tone(freq, start_t, dur, amp=0.3, wave_type='sin'):
    start_idx = int(start_t * sample_rate)
    end_idx = min(num_samples, int((start_t + dur) * sample_rate))
    for i in range(start_idx, end_idx):
        t = (i - start_idx) / sample_rate
        env = math.sin(math.pi * (t / dur)) if dur > 0 else 1.0
        
        if wave_type == 'sin':
            val = math.sin(2 * math.pi * freq * t)
        elif wave_type == 'saw':
            val = 2.0 * ((t * freq) % 1.0) - 1.0
        elif wave_type == 'square':
            val = 1.0 if math.sin(2 * math.pi * freq * t) > 0 else -1.0
        elif wave_type == 'noise':
            val = random.uniform(-1, 1)
        else:
            val = math.sin(2 * math.pi * freq * t)
            
        audio[i] += val * amp * env

def add_riser(start_t, dur, f_start=80, f_end=880, amp=0.25):
    start_idx = int(start_t * sample_rate)
    end_idx = min(num_samples, int((start_t + dur) * sample_rate))
    phase = 0.0
    for i in range(start_idx, end_idx):
        progress = (i - start_idx) / (end_idx - start_idx)
        cur_freq = f_start + (f_end - f_start) * (progress ** 2)
        phase += 2 * math.pi * cur_freq / sample_rate
        env = progress * (1 - 0.2 * math.sin(progress * math.pi))
        audio[i] += math.sin(phase) * amp * env

def add_sub_bass(start_t, dur=0.6, freq=60, amp=0.6):
    start_idx = int(start_t * sample_rate)
    end_idx = min(num_samples, int((start_t + dur) * sample_rate))
    for i in range(start_idx, end_idx):
        t = (i - start_idx) / sample_rate
        env = math.exp(-t * 5.0)
        pitch = freq * (1.0 + 1.5 * math.exp(-t * 20.0))
        audio[i] += math.sin(2 * math.pi * pitch * t) * amp * env

def add_click(start_t):
    start_idx = int(start_t * sample_rate)
    dur = 0.02
    end_idx = min(num_samples, int((start_t + dur) * sample_rate))
    for i in range(start_idx, end_idx):
        t = (i - start_idx) / sample_rate
        env = math.exp(-t * 200.0)
        audio[i] += (random.uniform(-1, 1) * 0.4 + math.sin(2 * math.pi * 1800 * t) * 0.3) * env

# 1. Opening impact (0.0s)
add_sub_bass(0.0, dur=0.8, freq=55, amp=0.7)
add_riser(0.1, 1.8, f_start=70, f_end=600, amp=0.2)

# 2. Typing clicks (2.0s - 3.0s)
for t_offset in [2.05, 2.18, 2.30, 2.45, 2.60, 2.75, 2.90]:
    add_click(t_offset)

# 3. Transition Whoosh Impact (3.0s)
add_sub_bass(3.0, dur=0.9, freq=50, amp=0.8)
add_riser(2.5, 0.5, f_start=300, f_end=1200, amp=0.35)

# 4. Melodic futuristic synth arp (3.2s - 7.2s)
notes = [440, 554.37, 659.25, 880, 659.25, 554.37, 740, 880]
for idx, n in enumerate(notes * 2):
    t_start = 3.2 + idx * 0.25
    if t_start + 0.3 < duration:
        add_tone(n, t_start, 0.28, amp=0.18, wave_type='sin')
        add_tone(n * 2, t_start, 0.28, amp=0.08, wave_type='sin')

# Final kick/pulse
add_sub_bass(5.5, dur=0.6, freq=65, amp=0.4)

# Normalize & write WAV
max_val = max(max(abs(x) for x in audio), 1e-6)
norm_audio = [x / max_val * 0.95 for x in audio]

out_path = "/media/parvej/68CAB4DDCAB4A9281/Web Projects New/parvejs-portfolio/reels/gemini_viral_short/audio.wav"
with wave.open(out_path, 'w') as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(sample_rate)
    frames = bytearray()
    for sample in norm_audio:
        int_sample = int(sample * 32767)
        frames.extend(struct.pack('<h', int_sample))
    wf.writeframes(frames)

print(f"Audio generated successfully at: {out_path}")
