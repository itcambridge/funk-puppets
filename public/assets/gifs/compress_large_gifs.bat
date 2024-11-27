@echo off

rem Check if we're in the right directory
cd E:\funk-puppets\public\assets\background
if errorlevel 1 (
    echo Error: Cannot find background directory
    exit /b
)

rem Set FFmpeg path
set FFMPEG=E:\funk-puppets\ffmpeg-N-117868-gecc7d5db9c-win64-gpl\bin\ffmpeg.exe

rem Verify we're in the right place
echo Current directory:
cd
dir *-bg*.gif

rem Clean compressed directory
if exist "compressed" rd /s /q compressed
mkdir compressed

rem Compress all background GIFs
echo.
echo Compressing background GIFs...
%FFMPEG% -i "bass-bg.gif" -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/bass-bg.gif
%FFMPEG% -i "bass-bg2.gif" -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/bass-bg2.gif
%FFMPEG% -i "bongos-bg.gif" -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/bongos-bg.gif
%FFMPEG% -i "bongos-bg2.gif" -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/bongos-bg2.gif
%FFMPEG% -i "cowbell-bg.gif" -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/cowbell-bg.gif
%FFMPEG% -i "cowbell-bg2.gif" -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/cowbell-bg2.gif
%FFMPEG% -i "drums-bg.gif" -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/drums-bg.gif
%FFMPEG% -i "drums-bg2.gif" -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/drums-bg2.gif
%FFMPEG% -i "guitar-bg.gif" -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/guitar-bg.gif
%FFMPEG% -i "guitar-bg2.gif" -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/guitar-bg2.gif
%FFMPEG% -i "synth-bg.gif" -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/synth-bg.gif
%FFMPEG% -i "synth-bg2.gif" -vf "scale=iw*0.8:-1:flags=lanczos,fps=15" -y compressed/synth-bg2.gif

rem Show results
echo.
echo Original sizes:
dir *-bg*.gif
echo.
echo Compressed sizes:
dir compressed\*.gif 