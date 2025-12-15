#include "utcdate.h"

#include <check.h>

utc_datetime_t dt;

#suite unittest

#tcase basic

#test test_zero
    ck_assert_int_eq(timestamp2dt(0, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test one_second
    ck_assert_int_eq(timestamp2dt(1, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 1);

#test one_minute
    ck_assert_int_eq(timestamp2dt(60, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 1);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test one_hour
    ck_assert_int_eq(timestamp2dt(3600, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 1);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test one_day
    ck_assert_int_eq(timestamp2dt(86400, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 2);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test one_month
    ck_assert_int_eq(timestamp2dt(2678400, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test one_year
    ck_assert_int_eq(timestamp2dt(31536000, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1971);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);
