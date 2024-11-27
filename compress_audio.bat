@echo off
if not exist "compressed" mkdir compressed

for %%f in (bass*.mp3 bongos*.mp3 cowbell*.mp3 drums*.mp3 guitar*.mp3 synth*.mp3) do (
    if not "%%~nf" == "%%~nf-compressed" (
        ffmpeg -i "%%f" -codec:a libmp3lame -b:a 112k "compressed\%%~nf.mp3"
    )
)

move compressed\*.mp3 .
rmdir compressed

echo Done! 