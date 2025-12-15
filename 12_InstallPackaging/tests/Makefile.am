TESTS = unit
check_PROGRAMS = unit

.ts.c:
	checkmk $< > $@

AM_CFLAGS = -I$(top_builddir)/include @CHECK_CFLAGS@
LDADD = $(top_builddir)/src/libutcdate.la @CHECK_LIBS@
