#include "utcdate.h"

#include <errno.h>

int
dtcheck(utc_datetime_t *pdt)
{
    uint8_t mo_days[] = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

    if (!pdt) {
        errno = EFAULT;
        return -1;
    }

    if ((pdt->date.year % 4u == 0 && pdt->date.year % 100u != 0)
            || pdt->date.year % 400u == 0) {
        ++mo_days[1];
    }

    return !(
            1 <= pdt->date.month
            && pdt->date.month <= 12
            && 1 <= pdt->date.day
            && pdt->date.day <= mo_days[pdt->date.month - 1]
            && 0 <= pdt->time.hours
            && pdt->time.hours <= 23
            && 0 <= pdt->time.minutes
            && pdt->time.minutes <= 59
            && 0 <= pdt->time.seconds
            && pdt->time.seconds <= 59
    );
}

weekday_t
get_weekday(utc_date_t *pd)
{
    utc_date_t d;
    int64_t tmp;

    if (!pd) {
        errno = EFAULT;
        return INVALID_WEEKDAY;
    }

    d = *pd;

    /* convert the date as if March was the first month of the year */
    if (d.month < 3) {
        --d.year;
        d.month += 10;
    } else {
        d.month -= 2;
    }

    if (d.year >= 0) {
        tmp = (
            d.year + d.year / 4 - d.year / 100 + d.year / 400
                    + d.day + (31 * d.month) / 12
        );
    } else {
        /* to evaluate integer division in math sense */
        tmp = (
            d.year + (d.year + 1) / 4 - (d.year + 1) / 100 + (d.year + 1) / 400
            + d.day + (31 * d.month) / 12 - 1
        );
    }

    if (tmp >= 0) {
        return (weekday_t)(tmp % 7);
    }

    return (weekday_t)(tmp - 7 * ((tmp + 1) / 7 - 1));
}

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

int
dt2timestamp(int64_t *pstamp, utc_datetime_t *pdt)
{
    int64_t stamp;
    int64_t tmp;
    uint8_t month_len[] = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

    if (!pdt) {
        errno = EFAULT;
        return -1;
    }

    /* Min datetime is -292277022657-01-27  8:29:52;
        max datetime is 292277026596-12-04 15:30:07 */
    if (pdt->date.year < -292277022657 || pdt->date.year > 292277026596) {
        errno = EOVERFLOW;
        return -1;
    } else if (pdt->date.year == -292277022657 && pdt->date.month == 1) {
        if (pdt->date.day < 27) {
            errno = EOVERFLOW;
            return -1;
        } else if (pdt->date.day == 27) {
            if (pdt->time.hours < 8) {
                errno = EOVERFLOW;
                return -1;
            } else if (pdt->time.hours == 8) {
                if (pdt->time.minutes < 29) {
                    errno = EOVERFLOW;
                    return -1;
                } else if (pdt->time.minutes == 29 && pdt->time.seconds < 52) {
                    errno = EOVERFLOW;
                    return -1;
                }
            }
        }
    } else if (pdt->date.year == 292277026596 && pdt->date.month == 12) {
        if (pdt->date.day > 4) {
            errno = EOVERFLOW;
            return -1;
        } else if (pdt->date.day == 4) {
            if (pdt->time.hours > 15) {
                errno = EOVERFLOW;
                return -1;
            } else if (pdt->time.hours == 15) {
                if (pdt->time.minutes > 30) {
                    errno = EOVERFLOW;
                    return -1;
                } else if (pdt->time.minutes == 30 && pdt->time.seconds > 7) {
                    errno = EOVERFLOW;
                    return -1;
                }
            }
        }
    }

    if (!pstamp) {
        return 0;
    }

    /* one more February day in case of a leap year */
    if ((pdt->date.year % 4u == 0 && pdt->date.year % 100u != 0)
            || pdt->date.year % 400u == 0) {
        ++month_len[1];
    }

    /* 86400 seconds in a day; 146097 days in a full 400-year cycle */
    stamp = (int64_t)86400 * 146097 * ((pdt->date.year - 1970) / 400);
    tmp = 1970 + (pdt->date.year - 1970) % 400;

    if (tmp >= 1970) {
        while (tmp-- > 1970) {
            stamp += 86400 * (365 +
                    ((tmp % 4u == 0 && tmp % 100u != 0) || tmp % 400u == 0)
            );
        }

        for (tmp = 1; tmp < pdt->date.month; ++tmp) {
            stamp += 86400 * month_len[tmp - 1];
        }

        stamp += 86400 * (pdt->date.day - 1);

        stamp += 3600 * pdt->time.hours;
        stamp += 60 * pdt->time.minutes;
        stamp += pdt->time.seconds;
    } else {
        while (++tmp < 1970) {
            stamp -= 86400 * (365 +
                    ((tmp % 4u == 0 && tmp % 100u != 0) || tmp % 400u == 0)
            );
        }

        for (tmp = 12; tmp > pdt->date.month; --tmp) {
            stamp -= 86400 * month_len[tmp - 1];
        }

        stamp -= 86400 * (month_len[tmp - 1] - pdt->date.day);

        stamp -= 3600 * (23 - pdt->time.hours);
        stamp -= 60 * (59 - pdt->time.minutes);
        stamp -= 60 - pdt->time.seconds;
    }

    *pstamp = stamp;
    return 0;
}
