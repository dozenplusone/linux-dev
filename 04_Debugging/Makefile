CFLAGS = -O0 -g
.PHONY: all clean test

all:	range test

range:	range.c

testcase%:	testcase%.gdb testcase%.ref.txt range
	gdb --batch --quiet -x $< range | grep ^start\= | cmp $@.ref.txt

test:	testcase1 testcase2

clean:
	rm -f range
