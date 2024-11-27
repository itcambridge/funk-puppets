@echo off
cd E:\funk-puppets\public\assets\background

rem Create backup directory
if not exist "originals" mkdir originals

rem Backup originals
move bass-bg2.gif originals\
move bongos-bg2.gif originals\
move drums-bg2.gif originals\
move guitar-bg2.gif originals\
move synth-bg2.gif originals\

rem Move compressed versions
move compressed\*.gif .
rmdir compressed

echo Done! Original files backed up in 'originals' directory
dir *-bg2.gif 