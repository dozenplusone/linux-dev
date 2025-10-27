CFLAGS = -Wall -Wextra
.PHONY: clean test

move:	move.c

clean:
	rm -f move

test:	test-rc0 test-rc1 test-rc2 test-rc3 test-rc4 test-rc6 test-rc7 test-rc8 test-rc9

test-%:	tests/%.sh move
	bash $< ./move
