#include "utcdate.h"

#include <errno.h>

int
timestamp2dt(int64_t stamp, utc_datetime_t *pdt)
{
    int64_t dateord;
    uint8_t month_len[] = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
    uint32_t days;
    uint32_t seconds;
    uint32_t cur;

    if (!pdt) {
        errno = EFAULT;
        return -1;
    }

    /* 86400 seconds in a day; 146097 days in a full 400-year cycle */
    if (stamp >= 0) {
        dateord = stamp / 86400;
        seconds = stamp % 86400;
        pdt->date.year = 1970 + 400 * (dateord / 146097);
        days = dateord % 146097;
    } else {
        /* to evaluate remainder in math sense */
        dateord = (stamp + 1) / 86400 - 1;
        seconds = stamp - 86400 * dateord;
        stamp = (dateord + 1) / 146097 - 1;
        pdt->date.year = 1970 + 400 * stamp;
        days = dateord - 146097 * stamp;
    }

    /* xx70 year (the starting one) is not leap */
    cur = 365;

    while (days >= cur) {
        days -= cur;
        ++pdt->date.year;
        cur = 365 + (
                (pdt->date.year % 4u == 0 && pdt->date.year % 100u != 0)
                || pdt->date.year % 400u == 0
        );
    }

    /* one more February day in case of a leap year */
    if (cur == 366) {
        ++month_len[1];
    }

    pdt->date.month = 1;

    for (cur = 0; days >= month_len[cur]; ++cur) {
        days -= month_len[cur];
        ++pdt->date.month;
    }

    pdt->date.day = 1 + days;

    pdt->time.hours = seconds / 3600u;
    pdt->time.minutes = seconds % 3600u / 60u;
    pdt->time.seconds = seconds % 60u;

    return 0;
}
