@echo off

rem Check if we're in the right directory
cd E:\funk-puppets\public\assets\background
if errorlevel 1 (
    echo Error: Cannot find background directory
    exit /b
)

rem Set FFmpeg path
set FFMPEG=E:\funk-puppets\ffmpeg-N-117868-gecc7d5db9c-win64-gpl\bin\ffmpeg.exe

rem Clean compressed directory
if exist "compressed" rd /s /q compressed
mkdir compressed

rem Compress all background GIFs with more aggressive settings
echo Compressing background GIFs...
set FILTERS=scale=iw*0.7:-1:flags=lanczos,fps=12,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5

%FFMPEG% -i "bass-bg2.gif" -vf "%FILTERS%" -y compressed/bass-bg2.gif
%FFMPEG% -i "bongos-bg2.gif" -vf "%FILTERS%" -y compressed/bongos-bg2.gif
%FFMPEG% -i "drums-bg2.gif" -vf "%FILTERS%" -y compressed/drums-bg2.gif
%FFMPEG% -i "guitar-bg2.gif" -vf "%FILTERS%" -y compressed/guitar-bg2.gif
%FFMPEG% -i "synth-bg2.gif" -vf "%FILTERS%" -y compressed/synth-bg2.gif

rem Show results
echo.
echo Original sizes:
dir *-bg2.gif
echo.
echo Compressed sizes:
dir compressed\*.gif 