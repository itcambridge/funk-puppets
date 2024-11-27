@echo off
rem Move MP4 file to spare
move synth-bg2.mp4 spare\

rem Verify final structure
echo Background files should be:
echo - Static: bg.png, bg2.png
echo - Regular: *-bg.gif
echo - Psychedelic: *-bg2.gif

dir *.png
echo.
dir *-bg.gif
echo.
dir *-bg2.gif 