CFLAGS = -Wall -O0 -g

bin_PROGRAMS=rhasher

rhasher_SOURCES=src/rhasher.c

.PHONY: clean test

test:	rhasher
	bash test/test.sh

clean:
	git clean -xdf .
