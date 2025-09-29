.PHONY: all clean distclean test
GENERATES = prog prog-a prog-so README liboutput_static.a liboutput.so
TRASH = *.o *~ o.* test*.txt
CFLAGS = -Wall -fPIC

all:    README prog prog-a prog-so test

.SECONDARY:	fun.o const.o
.INTERMEDIATE:	liboutput_static.a(fun.o const.o)

liboutput_static.a:	liboutput_static.a(fun.o const.o)

liboutput.so:	fun.o const.o
	cc -shared $^ -o $@

prog:	prog.o fun.o const.o

prog-a:	prog.o liboutput_static.a
	cc -L. $< -loutput_static -o $@

prog-so:	prog.o liboutput.so
	cc -L. $< -loutput -o $@

README: prog
	./$< 2> $@

fun.o prog.o:  outlib.h

clean:
	rm -f $(TRASH)

distclean:      clean
	rm -rf $(GENERATES)

test0-%.txt:	%
	(LD_LIBRARY_PATH=. exec -a arg0 ./$< > $@ 2>&1)

test1-%.txt:	%
	(LD_LIBRARY_PATH=. exec -a arg0 ./$< 42 > $@ 2>&1)

test3-%.txt:	%
	(LD_LIBRARY_PATH=. exec -a arg0 ./$< 123 456 789 > $@ 2>&1)

test%:	test%-prog.txt test%-prog-a.txt test%-prog-so.txt
	cmp $@-prog.txt $@-prog-a.txt && cmp $@-prog.txt $@-prog-so.txt

test:	test0 test1 test3
