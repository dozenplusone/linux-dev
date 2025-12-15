#include "utcdate.h"

#include <check.h>
#include <errno.h>

utc_datetime_t dt;

#suite timestamp2dt_tests

#tcase timestamp2dt_basic

#test timestamp2dt_zero
    ck_assert_int_eq(timestamp2dt(0, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_1sec
    ck_assert_int_eq(timestamp2dt(1, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 1);

#test timestamp2dt_1min
    ck_assert_int_eq(timestamp2dt(60, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 1);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_1hr
    ck_assert_int_eq(timestamp2dt(3600, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 1);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_1d
    ck_assert_int_eq(timestamp2dt(86400, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 2);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_1mo
    ck_assert_int_eq(timestamp2dt(2678400, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_1yr
    ck_assert_int_eq(timestamp2dt(31536000, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1971);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#tcase timestamp2dt_field_overflowing

#test timestamp2dt_sec_overflow
    ck_assert_int_eq(timestamp2dt(59, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(61, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 1);
    ck_assert_uint_eq(dt.time.seconds, 1);

#test timestamp2dt_min_overflow
    ck_assert_int_eq(timestamp2dt(3599, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(3601, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 1);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 1);

#test timestamp2dt_hr_overflow
    ck_assert_int_eq(timestamp2dt(86399, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(86401, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 2);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 1);

#test timestamp2dt_mo_overflow
    ck_assert_int_eq(timestamp2dt(31535999, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1970);
    ck_assert_uint_eq(dt.date.month, 12);
    ck_assert_uint_eq(dt.date.day, 31);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(31536001, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1971);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 1);

#tcase timestamp2dt_days_overflowing

#test timestamp2dt_jan_overflow
    ck_assert_int_eq(timestamp2dt(1738367999, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 31);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(1738368000, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_feb_overflow
    ck_assert_int_eq(timestamp2dt(1740787199, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 28);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(1740787200, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 3);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_mar_overflow
    ck_assert_int_eq(timestamp2dt(1743465599, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 3);
    ck_assert_uint_eq(dt.date.day, 31);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(1743465600, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 4);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_apr_overflow
    ck_assert_int_eq(timestamp2dt(1746057599, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 4);
    ck_assert_uint_eq(dt.date.day, 30);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(1746057600, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 5);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_may_overflow
    ck_assert_int_eq(timestamp2dt(1748735999, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 5);
    ck_assert_uint_eq(dt.date.day, 31);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(1748736000, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 6);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_jun_overflow
    ck_assert_int_eq(timestamp2dt(1751327999, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 6);
    ck_assert_uint_eq(dt.date.day, 30);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(1751328000, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 7);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_jul_overflow
    ck_assert_int_eq(timestamp2dt(1754006399, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 7);
    ck_assert_uint_eq(dt.date.day, 31);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(1754006400, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 8);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_aug_overflow
    ck_assert_int_eq(timestamp2dt(1756684799, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 8);
    ck_assert_uint_eq(dt.date.day, 31);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(1756684800, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 9);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_sep_overflow
    ck_assert_int_eq(timestamp2dt(1759276799, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 9);
    ck_assert_uint_eq(dt.date.day, 30);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(1759276800, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 10);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_oct_overflow
    ck_assert_int_eq(timestamp2dt(1761955199, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 10);
    ck_assert_uint_eq(dt.date.day, 31);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(1761955200, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 11);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_nov_overflow
    ck_assert_int_eq(timestamp2dt(1764547199, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 11);
    ck_assert_uint_eq(dt.date.day, 30);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(1764547200, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2025);
    ck_assert_uint_eq(dt.date.month, 12);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#tcase timestamp2dt_leap_years_feb_overflow

#test timestamp2dt_div_by_4_not_by_100
    ck_assert_int_eq(timestamp2dt(1709164799, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2024);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 28);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(1709164800, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2024);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 29);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);
    ck_assert_int_eq(timestamp2dt(1709251199, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2024);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 29);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(1709251200, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2024);
    ck_assert_uint_eq(dt.date.month, 3);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_div_by_400
    ck_assert_int_eq(timestamp2dt(951782399, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2000);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 28);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(951782400, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2000);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 29);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);
    ck_assert_int_eq(timestamp2dt(951868799, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2000);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 29);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(951868800, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2000);
    ck_assert_uint_eq(dt.date.month, 3);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_div_by_100_not_by_400
    ck_assert_int_eq(timestamp2dt(4107542399, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2100);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 28);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(4107542400, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2100);
    ck_assert_uint_eq(dt.date.month, 3);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#tcase timestamp2dt_neg_stamps

#test timestamp2dt_minus1
    ck_assert_int_eq(timestamp2dt(-1, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1969);
    ck_assert_uint_eq(dt.date.month, 12);
    ck_assert_uint_eq(dt.date.day, 31);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);

#test timestamp2dt_feb_29_1600
    ck_assert_int_eq(timestamp2dt(-11670998401, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1600);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 28);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(-11670998400, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1600);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 29);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);
    ck_assert_int_eq(timestamp2dt(-11670912001, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1600);
    ck_assert_uint_eq(dt.date.month, 2);
    ck_assert_uint_eq(dt.date.day, 29);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(-11670912000, &dt), 0);
    ck_assert_int_eq(dt.date.year, 1600);
    ck_assert_uint_eq(dt.date.month, 3);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#tcase timestamp2dt_coreutils_date_range_limits
#test timestamp2dt_upper_bound
    ck_assert_int_eq(timestamp2dt(67768036191676799, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2147485547);
    ck_assert_uint_eq(dt.date.month, 12);
    ck_assert_uint_eq(dt.date.day, 31);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);
    ck_assert_int_eq(timestamp2dt(67768036191676800, &dt), 0);
    ck_assert_int_eq(dt.date.year, 2147485548);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);

#test timestamp2dt_lower_bound
    ck_assert_int_eq(timestamp2dt(-67768040609740800, &dt), 0);
    ck_assert_int_eq(dt.date.year, -2147481748);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 1);
    ck_assert_uint_eq(dt.time.hours, 0);
    ck_assert_uint_eq(dt.time.minutes, 0);
    ck_assert_uint_eq(dt.time.seconds, 0);
    ck_assert_int_eq(timestamp2dt(-67768040609740801, &dt), 0);
    ck_assert_int_eq(dt.date.year, -2147481749);
    ck_assert_uint_eq(dt.date.month, 12);
    ck_assert_uint_eq(dt.date.day, 31);
    ck_assert_uint_eq(dt.time.hours, 23);
    ck_assert_uint_eq(dt.time.minutes, 59);
    ck_assert_uint_eq(dt.time.seconds, 59);

#tcase timestamp2dt_int64_timestamp_limits
#test timestamp2dt_int64_max
    ck_assert_int_eq(timestamp2dt(INT64_MAX, &dt), 0);
    ck_assert_int_eq(dt.date.year, 292277026596);
    ck_assert_uint_eq(dt.date.month, 12);
    ck_assert_uint_eq(dt.date.day, 4);
    ck_assert_uint_eq(dt.time.hours, 15);
    ck_assert_uint_eq(dt.time.minutes, 30);
    ck_assert_uint_eq(dt.time.seconds, 7);

#test timestamp2dt_int64_min
    ck_assert_int_eq(timestamp2dt(INT64_MIN, &dt), 0);
    ck_assert_int_eq(dt.date.year, -292277022657);
    ck_assert_uint_eq(dt.date.month, 1);
    ck_assert_uint_eq(dt.date.day, 27);
    ck_assert_uint_eq(dt.time.hours, 8);
    ck_assert_uint_eq(dt.time.minutes, 29);
    ck_assert_uint_eq(dt.time.seconds, 52);

#tcase timestamp2dt_errors

#test timestamp2dt_null_pdt
    ck_assert_int_eq(timestamp2dt(INT64_MIN, NULL), -1);
    ck_assert_int_eq(errno, EFAULT);
