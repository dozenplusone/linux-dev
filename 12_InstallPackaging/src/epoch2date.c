#include "utcdate.h"

#include <errno.h>
#include <stdio.h>
#include <stdlib.h>

static const char *const WEEKDAY_NAMES[] = {
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
};

static const char *const MONTH_NAMES[] = {
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
};

int
main(int argc, char *argv[])
{
    utc_datetime_t dt;
    int64_t stamp;
    weekday_t wd;
    int err;

    if (argc < 2) {
        return 1;
    }

    err = errno;
    stamp = strtoll(argv[1], NULL, 0);

    if (errno != err) {
        return 2;
    }

    if (timestamp2dt(stamp, &dt) != 0
            || (wd = get_weekday(&dt.date)) == INVALID_WEEKDAY) {
        return 3;
    }

    printf("%4$s %2$s %3$2hhu %5$02hhu:%6$02hhu:%7$02hhu UTC %1$04ld\n",
            dt.date.year, MONTH_NAMES[dt.date.month - 1], dt.date.day,
            WEEKDAY_NAMES[wd],
            dt.time.hours, dt.time.minutes, dt.time.seconds);
    return 0;
}
