#                                               -*- Autoconf -*-
# Process this file with autoconf to produce a configure script.

AC_PREREQ([2.72])
AC_INIT([epoch2date], [0.1.0], [username@example.com])
AM_INIT_AUTOMAKE([foreign])
LT_INIT([])
AM_GNU_GETTEXT([external])
AM_GNU_GETTEXT_VERSION([0.23])
AC_CONFIG_SRCDIR([src/libutcdate.c])
AC_CONFIG_HEADERS([config.h])
ALL_LINGUAS="ru"

# Checks for programs.
AC_PROG_CC

# Checks for pkgconfig-friendly packages.
PKG_CHECK_MODULES([CHECK], [check])

# Checks for libraries.

# Checks for header files.
AC_CHECK_HEADERS([stdint.h])

# Checks for typedefs, structures, and compiler characteristics.
AC_TYPE_INT64_T
AC_TYPE_UINT32_T
AC_TYPE_UINT8_T

# Checks for library functions.

AC_CONFIG_FILES([Makefile
                 include/Makefile
                 po/Makefile.in
                 src/Makefile
                 tests/Makefile])
AC_OUTPUT
