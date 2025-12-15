TESTS = timestamp2dt dt2timestamp
check_PROGRAMS = timestamp2dt dt2timestamp

.ts.c:
	checkmk $< > $@

AM_CFLAGS = -I$(top_builddir)/include @CHECK_CFLAGS@
LDADD = $(top_builddir)/src/libutcdate.la @CHECK_LIBS@
