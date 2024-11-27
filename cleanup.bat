@echo off
mkdir originals 2>nul

move singer1.mp3 originals\
move singer2.mp3 originals\
move singer3.mp3 originals\
move singer4.mp3 originals\
move singer5.mp3 originals\
move singer6.mp3 originals\

ren singer1-compressed.mp3 singer1.mp3
ren singer2-compressed.mp3 singer2.mp3
ren singer3-compressed.mp3 singer3.mp3
ren singer4-compressed.mp3 singer4.mp3
ren singer5-compressed.mp3 singer5.mp3
ren singer6-compressed.mp3 singer6.mp3

del bass1-compressed.mp3

move cowbell7.mp3 spare\
move drums7.mp3 spare\
move bongos.mp3 spare\ 