TESTS = timestamp2dt dt2timestamp get_weekday
check_PROGRAMS = timestamp2dt dt2timestamp get_weekday

.ts.c:
	checkmk $< > $@

AM_CFLAGS = -I$(top_builddir)/include @CHECK_CFLAGS@
LDADD = $(top_builddir)/src/libutcdate.la @CHECK_LIBS@
