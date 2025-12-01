CFLAGS = -std=c99 -Wall -Wextra

if GCOV_ENABLED
CFLAGS += -O0 -g -fprofile-arcs -ftest-coverage
else
CFLAGS += -O3 -g3
endif

lib_LTLIBRARIES=libbuf.la
libbuf_la_LDFLAGS = -version-info 1:0:1

gcov:
	gcov -o .libs libbuf -t -k -b | grep -vE '[[:digit:]]:[ /][*]'
