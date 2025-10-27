CFLAGS = -Wall -Wextra
.PHONY: clean test

all:	move preload.so

move:	move.c

preload.so:	preload.c
	cc $(CFLAGS) -fPIC -shared $< -o $@

clean:
	rm -f move preload.so

test:	test-rc0 test-rc1 test-rc2 test-rc3 test-rc4 test-rc6 test-rc7 test-rc8 test-rc9 test-preload

test-rc%:	tests/rc%.sh move
	bash $< ./move

test-preload:	tests/preload.sh move preload.so
	bash $< ./move preload.so

