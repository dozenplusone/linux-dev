#                                               -*- Autoconf -*-
# Process this file with autoconf to produce a configure script.

AC_PREREQ([2.72])
AC_INIT([rhasher], [0.1.0], [username@example.com])
AM_INIT_AUTOMAKE([foreign subdir-objects])
AC_CONFIG_SRCDIR([src/rhasher.c])
AC_CONFIG_HEADERS([config.h])

# Checks for programs.
AC_PROG_CC

# Process options.
AC_ARG_WITH([readline],
    AS_HELP_STRING([--with-readline], [Use GNU readline instead of getline])
)

# Checks for libraries.
AC_CHECK_LIB([rhash],
    [rhash_library_init],
    [],
    [AC_MSG_ERROR([rhash is required])]
)
AS_IF([test "$with_readline" != "no"],
    AC_CHECK_LIB([readline],
        [readline],
        [],
        [AC_MSG_WARN([no readline found; falling back to getline])]
    )
)

# Checks for header files.
AC_CHECK_HEADERS([strings.h])
AC_CHECK_HEADER([rhash.h])
AS_IF([test "$with_readline" != "no"],
    AC_CHECK_HEADER([readline/readline.h])
)

# Checks for typedefs, structures, and compiler characteristics.
AC_TYPE_SIZE_T

# Checks for library functions.
AC_CHECK_FUNCS([strcasecmp strchr strerror])

AC_CONFIG_FILES([Makefile])
AC_OUTPUT
