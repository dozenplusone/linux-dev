CFLAGS = -O2 -Wall
AM_CFLAGS = -I$(top_builddir)/include -D'LOCALE_PATH="$(localedir)"'

lib_LTLIBRARIES=libutcdate.la
libutcdate_la_LDFLAGS = -version-info 1:0:1

bin_PROGRAMS=epoch2date
epoch2date_SOURCES=epoch2date.c
LDADD=libutcdate.la

epoch2date.1:	epoch2date
	help2man -s1 -LC -N ./epoch2date > $@

man1_MANS = epoch2date.1
