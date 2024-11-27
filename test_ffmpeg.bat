@echo off
cd E:\funk-puppets\public\assets\gifs

rem Set and verify FFmpeg path
set FFMPEG=E:\funk-puppets\ffmpeg-N-117868-gecc7d5db9c-win64-gpl\bin\ffmpeg.exe
echo FFmpeg path is: %FFMPEG%
echo.

rem Test FFmpeg
echo Testing FFmpeg...
%FFMPEG% -version 