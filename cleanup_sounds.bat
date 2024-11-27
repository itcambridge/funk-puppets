@echo off
if not exist "originals" mkdir originals

rem Move original singer files
move singer[1-6].mp3 originals\

rem Move compressed singer files to main directory and rename
for %%f in (singer*-compressed.mp3) do (
    ren "%%f" "%%~nf.mp3"
)

rem Remove duplicate bass1-compressed
del bass1-compressed.mp3

rem Move extra numbered tracks to spare
move *7.mp3 spare\
move *8.mp3 spare\
move *9.mp3 spare\
move bongos.mp3 spare\ 