@echo off
cd E:\funk-puppets\public\assets\gifs

rem Create backup directory
if not exist "originals" mkdir originals

rem Backup originals
move cowbell.gif originals\
move drums.gif originals\
move guitar.gif originals\
move synth.gif originals\

rem Move compressed versions
move compressed\*.gif .
rmdir compressed

echo Done! Original files backed up in 'originals' directory
dir *.gif 