#                                               -*- Autoconf -*-
# Process this file with autoconf to produce a configure script.

AC_PREREQ([2.72])
AC_INIT([libbuf], [0.1.0], [username@example.com])
AM_INIT_AUTOMAKE([foreign])
LT_INIT([])
AC_CONFIG_SRCDIR([src/libbuf.c])
AC_CONFIG_HEADERS([config.h])

# Checks for programs.
AC_PROG_CC

# Process options.
AC_ARG_ENABLE([gcov],
              [AS_HELP_STRING([--enable-gcov], [use gcov to check test coverage])],
              [], [enable_gcov=no])
AM_CONDITIONAL([GCOV_ENABLED], [test "$enable_gcov" != no])

# Joint pkgconfig library/include tests
PKG_CHECK_MODULES([CHECK], [check])

# Checks for libraries.

# Checks for header files.

# Checks for typedefs, structures, and compiler characteristics.
AC_TYPE_SIZE_T
AC_CHECK_TYPES([ptrdiff_t])

# Checks for library functions.
AC_FUNC_MALLOC
AC_FUNC_REALLOC

AC_CONFIG_FILES([Makefile
                 src/Makefile
                 tests/Makefile])
AC_OUTPUT
