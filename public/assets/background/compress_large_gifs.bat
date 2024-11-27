@echo off
cd E:\funk-puppets\public\assets\background

rem Create backup directory
if not exist "originals" mkdir originals

rem Backup originals
move bass-bg.gif originals\
move bongos-bg.gif originals\
move cowbell-bg.gif originals\
move cowbell-bg2.gif originals\
move drums-bg.gif originals\
move guitar-bg.gif originals\
move synth-bg.gif originals\

rem Move compressed versions
move compressed\*.gif .
rmdir compressed

echo Done! Original files backed up in 'originals' directory
dir *-bg.gif