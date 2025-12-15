#include "utcdate.h"

#include <check.h>
#include <errno.h>

utc_date_t d;

#suite get_weekday_tests

#tcase get_weekday_basic

#test get_weekday_zero
    d.year = 1970;
    d.month = 1;
    d.day = 1;
    ck_assert_int_eq(get_weekday(&d), THURSDAY);

#test get_weekday_y2k38
    d.year = 2038;
    d.month = 1;
    d.day = 19;
    ck_assert_int_eq(get_weekday(&d), TUESDAY);
    d.year = 1901;
    d.month = 12;
    d.day = 13;
    ck_assert_int_eq(get_weekday(&d), FRIDAY);

#test get_weekday_proleptic
    d.year = 1380;
    d.month = 9;
    d.day = 16;
    ck_assert_int_eq(get_weekday(&d), SATURDAY);

#test get_weekday_neg
    d.year = -43;
    d.month = 3;
    d.day = 13;
    ck_assert_int_eq(get_weekday(&d), WEDNESDAY);

#tcase get_weekday_febmar

#test get_weekday_y2k
    d.year = 2000;
    d.month = 2;
    d.day = 28;
    ck_assert_int_eq(get_weekday(&d), MONDAY);
    ++d.day;
    ck_assert_int_eq(get_weekday(&d), TUESDAY);
    ++d.month;
    d.day = 1;
    ck_assert_int_eq(get_weekday(&d), WEDNESDAY);

#test get_weekday_2024
    d.year = 2024;
    d.month = 2;
    d.day = 28;
    ck_assert_int_eq(get_weekday(&d), WEDNESDAY);
    ++d.day;
    ck_assert_int_eq(get_weekday(&d), THURSDAY);
    ++d.month;
    d.day = 1;
    ck_assert_int_eq(get_weekday(&d), FRIDAY);

#test get_weekday_2025
    d.year = 2025;
    d.month = 2;
    d.day = 28;
    ck_assert_int_eq(get_weekday(&d), FRIDAY);
    ++d.month;
    d.day = 1;
    ck_assert_int_eq(get_weekday(&d), SATURDAY);

#test get_weekday_2100
    d.year = 2100;
    d.month = 2;
    d.day = 28;
    ck_assert_int_eq(get_weekday(&d), SUNDAY);
    ++d.month;
    d.day = 1;
    ck_assert_int_eq(get_weekday(&d), MONDAY);

#test get_weekday_year0
    d.year = 0;
    d.month = 2;
    d.day = 28;
    ck_assert_int_eq(get_weekday(&d), MONDAY);
    ++d.day;
    ck_assert_int_eq(get_weekday(&d), TUESDAY);
    ++d.month;
    d.day = 1;
    ck_assert_int_eq(get_weekday(&d), WEDNESDAY);

#tcase get_weekday_fullweek

#test get_weekday_early2026
    d.year = 2026;
    d.month = 1;
    d.day = 1;
    ck_assert_int_eq(get_weekday(&d), THURSDAY);
    ++d.day;
    ck_assert_int_eq(get_weekday(&d), FRIDAY);
    ++d.day;
    ck_assert_int_eq(get_weekday(&d), SATURDAY);
    ++d.day;
    ck_assert_int_eq(get_weekday(&d), SUNDAY);
    ++d.day;
    ck_assert_int_eq(get_weekday(&d), MONDAY);
    ++d.day;
    ck_assert_int_eq(get_weekday(&d), TUESDAY);
    ++d.day;
    ck_assert_int_eq(get_weekday(&d), WEDNESDAY);
    ++d.day;
    ck_assert_int_eq(get_weekday(&d), THURSDAY);

#tcase get_weekday_errors

#test get_weekday_null_pd
    ck_assert_int_eq(get_weekday(NULL), INVALID_WEEKDAY);
    ck_assert_int_eq(errno, EFAULT);
