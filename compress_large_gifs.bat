@echo off
cd E:\funk-puppets\public\assets\gifs

rem Set FFmpeg path
set FFMPEG=E:\funk-puppets\ffmpeg-N-117868-gecc7d5db9c-win64-gpl\bin\ffmpeg.exe

rem Clean compressed directory
if exist "compressed" rd /s /q compressed
mkdir compressed

rem Compress GIFs over 6MB
echo Compressing large GIFs...
%FFMPEG% -i cowbell.gif -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/cowbell.gif
%FFMPEG% -i drums.gif -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/drums.gif
%FFMPEG% -i guitar.gif -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/guitar.gif
%FFMPEG% -i synth.gif -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/synth.gif

rem Show results
echo.
echo Original sizes:
dir cowbell.gif drums.gif guitar.gif synth.gif
echo.
echo Compressed sizes:
dir compressed\*.gif 