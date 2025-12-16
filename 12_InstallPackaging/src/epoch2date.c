#include "config.h"
#include "utcdate.h"

#include <errno.h>
#include <libintl.h>
#include <locale.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define _(STR) gettext(STR)

int
main(int argc, char *argv[])
{
    char *MONTH_NAMES[12];
    char *WEEKDAY_NAMES[7];
    utc_datetime_t dt;
    int64_t stamp;
    weekday_t wd;
    int err;

    setlocale(LC_ALL, "");
    bindtextdomain(PACKAGE, LOCALE_PATH);
    textdomain(PACKAGE);

    if (argc < 2) {
        printf(_(
            "%s: missing operand\n"
            "Try '%s --help' for more information.\n"
        ), PACKAGE, argv[0]);
        return 1;
    } else if (!strcmp(argv[1], "-h") || !strcmp(argv[1], "--help")) {
        printf(_(
            "Usage: %s [-h | --help | -v | --version] STAMP\n"
            "Convert Unix timestamp STAMP to datetime.\n"
            "\n"
            "  -h, --help        display this help and exit\n"
            "  -v, --version     output version information and exit\n"
        ), argv[0]);
        return 0;
    } else if (!strcmp(argv[1], "-v") || !strcmp(argv[1], "--version")) {
        printf("%s\n", PACKAGE_STRING);
        return 0;
    }

    err = errno;
    stamp = strtoll(argv[1], NULL, 0);

    if (errno != err
            || timestamp2dt(stamp, &dt) != 0
            || (wd = get_weekday(&dt.date)) == INVALID_WEEKDAY) {
        printf(_("%s: conversion failed\n"), argv[0]);
        return 1;
    }

    MONTH_NAMES[0] = _("Jan");
    MONTH_NAMES[1] = _("Feb");
    MONTH_NAMES[2] = _("Mar");
    MONTH_NAMES[3] = _("Apr");
    MONTH_NAMES[4] = _("May");
    MONTH_NAMES[5] = _("Jun");
    MONTH_NAMES[6] = _("Jul");
    MONTH_NAMES[7] = _("Aug");
    MONTH_NAMES[8] = _("Sep");
    MONTH_NAMES[9] = _("Oct");
    MONTH_NAMES[10] = _("Nov");
    MONTH_NAMES[11] = _("Dec");

    WEEKDAY_NAMES[0] = _("Sun");
    WEEKDAY_NAMES[1] = _("Mon");
    WEEKDAY_NAMES[2] = _("Tue");
    WEEKDAY_NAMES[3] = _("Wed");
    WEEKDAY_NAMES[4] = _("Thu");
    WEEKDAY_NAMES[5] = _("Fri");
    WEEKDAY_NAMES[6] = _("Sat");

    printf(_("%4$s %2$s %3$2hhu %5$02hhu:%6$02hhu:%7$02hhu UTC %1$04ld\n"),
            dt.date.year, MONTH_NAMES[dt.date.month - 1], dt.date.day,
            WEEKDAY_NAMES[wd],
            dt.time.hours, dt.time.minutes, dt.time.seconds);
    return 0;
}
