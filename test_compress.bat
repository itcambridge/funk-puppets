@echo off
cd E:\funk-puppets\public\assets\gifs

rem Set FFmpeg path
set FFMPEG=E:\funk-puppets\ffmpeg-N-117868-gecc7d5db9c-win64-gpl\bin\ffmpeg.exe

rem Clean compressed directory
if exist "compressed" rd /s /q compressed
mkdir compressed

rem Test compression with one file
echo Testing compression on cowbell.gif...
%FFMPEG% -i cowbell.gif -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" compressed/cowbell.gif

rem Show results
echo Original size:
dir cowbell.gif
echo.
echo Compressed size:
dir compressed\cowbell.gif 