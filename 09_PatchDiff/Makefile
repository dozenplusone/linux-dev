CFLAGS = -Wall -Wextra
.PHONY: run clean

run:	maze maze1 maze2 maze3
	./maze
	./maze1 8
	./maze2 ' @' 5
	./maze3 42 '.#' 7
	./maze3 1337 '.#' 4
	./maze3 42 '.#' 7

maze%:	maze%.c

maze1.c:	maze.c 0001-Pass-size-as-parameter.patch
	patch $^ -o $@

maze2.c:	maze1.c 0002-Allow-for-arbitrary-symbols.patch
	patch $^ -o $@

maze3.c:	maze2.c 0003-Pass-random-seed-as-parameter.patch
	patch $^ -o $@

clean:
	rm -f maze maze? maze?.c
