@echo off
cd E:\funk-puppets\public\assets\gifs

rem Create spare directory if it doesn't exist
if not exist "spare" mkdir spare

rem Move unused files to spare
move "bg - Copy.png" spare\
move "*cowbellbg.mp4" spare\
move "*drumsbg.mp4" spare\
move "Gen-2*" spare\

rem Remove duplicate bass gif
del "bass-ezgif.com-gif-maker.gif"

rem Move compressed versions to main directory
move "compressed\bass.gif" .
move "compressed\bongos.gif" .
move "compressed\drums.gif" .
move "compressed\guitar.gif" .
move "compressed\synth.gif" .
move "compressed\logo1.gif" .

rem Keep original singer.gif since compressed is larger
del "compressed\singer.gif"

rem Clean up
rmdir compressed

echo Final files should be:
echo - Instrument GIFs: bass, bongos, cowbell, drums, guitar, synth
echo - Other: logo.gif, logo1.gif, singer.gif
dir *.gif