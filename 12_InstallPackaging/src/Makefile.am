CFLAGS = -O2 -Wall
AM_CFLAGS = -I$(top_builddir)/include

lib_LTLIBRARIES=libutcdate.la
libutcdate_la_LDFLAGS = -version-info 1:0:1

bin_PROGRAMS=epoch2date
epoch2date_SOURCES=epoch2date.c
LDADD=libutcdate.la
