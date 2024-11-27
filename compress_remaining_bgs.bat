@echo off
cd E:\funk-puppets\public\assets\background

rem Set FFmpeg path
set FFMPEG=E:\funk-puppets\ffmpeg-N-117868-gecc7d5db9c-win64-gpl\bin\ffmpeg.exe

rem Clean compressed directory
if exist "compressed" rd /s /q compressed
mkdir compressed

rem Compress remaining background GIFs with same settings
echo Compressing remaining background GIFs...
set FILTERS=scale=iw*0.7:-1:flags=lanczos,fps=12,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5

%FFMPEG% -i "bass-bg.gif" -vf "%FILTERS%" -y compressed/bass-bg.gif
%FFMPEG% -i "bongos-bg.gif" -vf "%FILTERS%" -y compressed/bongos-bg.gif
%FFMPEG% -i "cowbell-bg.gif" -vf "%FILTERS%" -y compressed/cowbell-bg.gif
%FFMPEG% -i "cowbell-bg2.gif" -vf "%FILTERS%" -y compressed/cowbell-bg2.gif
%FFMPEG% -i "drums-bg.gif" -vf "%FILTERS%" -y compressed/drums-bg.gif
%FFMPEG% -i "guitar-bg.gif" -vf "%FILTERS%" -y compressed/guitar-bg.gif
%FFMPEG% -i "synth-bg.gif" -vf "%FILTERS%" -y compressed/synth-bg.gif

rem Show results
echo.
echo Original sizes:
dir *-bg.gif cowbell-bg2.gif
echo.
echo Compressed sizes:
dir compressed\*.gif 