@echo off
rem Move duplicate and extra files to spare
move "drums3 (2).mp3" spare\
move drums7.mp3 spare\

rem Delete batch files we don't need anymore
del cleanup_sound.bat
del compress_audio.bat

rem Verify file counts
echo Regular tracks (should be 6 each):
dir bass?.mp3 /b | find /c /v ""
dir bongos?.mp3 /b | find /c /v ""
dir cowbell?.mp3 /b | find /c /v ""
dir drums?.mp3 /b | find /c /v ""
dir guitar?.mp3 /b | find /c /v ""
dir synth?.mp3 /b | find /c /v ""

echo Singer tracks (should be 6):
dir singer?.mp3 /b | find /c /v ""

echo.
echo Final structure should be:
echo - 6 tracks each for bass, bongos, cowbell, drums, guitar, synth (113KB)
echo - 6 tracks for singer (97KB) 