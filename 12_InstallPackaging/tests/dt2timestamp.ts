#include "utcdate.h"

#include <check.h>
#include <errno.h>

utc_datetime_t dt;
int64_t stamp;

#suite dt2timestamp_tests

#tcase dt2timestamp_basic

#test dt2timestamp_zero
    dt.date.year = 1970;
    dt.date.month = 1;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 0);

#test dt2timestamp_1sec
    dt.date.year = 1970;
    dt.date.month = 1;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 1;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1);

#test dt2timestamp_1min
    dt.date.year = 1970;
    dt.date.month = 1;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 1;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 60);

#test dt2timestamp_1hr
    dt.date.year = 1970;
    dt.date.month = 1;
    dt.date.day = 1;
    dt.time.hours = 1;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 3600);

#test dt2timestamp_1d
    dt.date.year = 1970;
    dt.date.month = 1;
    dt.date.day = 2;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 86400);

#test dt2timestamp_1mo
    dt.date.year = 1970;
    dt.date.month = 2;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 2678400);

#test dt2timestamp_1yr
    dt.date.year = 1971;
    dt.date.month = 1;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 31536000);

#tcase dt2timestamp_field_overflowing

#test dt2timestamp_sec_overflow
    dt.date.year = 1970;
    dt.date.month = 1;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 59);
    dt.date.year = 1970;
    dt.date.month = 1;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 1;
    dt.time.seconds = 1;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 61);

#test dt2timestamp_min_overflow
    dt.date.year = 1970;
    dt.date.month = 1;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 3599);
    dt.date.year = 1970;
    dt.date.month = 1;
    dt.date.day = 1;
    dt.time.hours = 1;
    dt.time.minutes = 0;
    dt.time.seconds = 1;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 3601);

#test dt2timestamp_hr_overflow
    dt.date.year = 1970;
    dt.date.month = 1;
    dt.date.day = 1;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 86399);
    dt.date.year = 1970;
    dt.date.month = 1;
    dt.date.day = 2;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 1;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 86401);

#test dt2timestamp_mo_overflow
    dt.date.year = 1970;
    dt.date.month = 12;
    dt.date.day = 31;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 31535999);
    dt.date.year = 1971;
    dt.date.month = 1;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 1;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 31536001);

#tcase dt2timestamp_days_overflowing

#test dt2timestamp_jan_overflow
    dt.date.year = 2025;
    dt.date.month = 1;
    dt.date.day = 31;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1738367999);
    dt.date.year = 2025;
    dt.date.month = 2;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1738368000);

#test dt2timestamp_feb_overflow
    dt.date.year = 2025;
    dt.date.month = 2;
    dt.date.day = 28;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1740787199);
    dt.date.year = 2025;
    dt.date.month = 3;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1740787200);

#test dt2timestamp_mar_overflow
    dt.date.year = 2025;
    dt.date.month = 3;
    dt.date.day = 31;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1743465599);
    dt.date.year = 2025;
    dt.date.month = 4;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1743465600);

#test dt2timestamp_apr_overflow
    dt.date.year = 2025;
    dt.date.month = 4;
    dt.date.day = 30;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1746057599);
    dt.date.year = 2025;
    dt.date.month = 5;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1746057600);

#test dt2timestamp_may_overflow
    dt.date.year = 2025;
    dt.date.month = 5;
    dt.date.day = 31;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1748735999);
    dt.date.year = 2025;
    dt.date.month = 6;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1748736000);

#test dt2timestamp_jun_overflow
    dt.date.year = 2025;
    dt.date.month = 6;
    dt.date.day = 30;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1751327999);
    dt.date.year = 2025;
    dt.date.month = 7;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1751328000);

#test dt2timestamp_jul_overflow
    dt.date.year = 2025;
    dt.date.month = 7;
    dt.date.day = 31;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1754006399);
    dt.date.year = 2025;
    dt.date.month = 8;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1754006400);

#test dt2timestamp_aug_overflow
    dt.date.year = 2025;
    dt.date.month = 8;
    dt.date.day = 31;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1756684799);
    dt.date.year = 2025;
    dt.date.month = 9;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1756684800);

#test dt2timestamp_sep_overflow
    dt.date.year = 2025;
    dt.date.month = 9;
    dt.date.day = 30;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1759276799);
    dt.date.year = 2025;
    dt.date.month = 10;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1759276800);

#test dt2timestamp_oct_overflow
    dt.date.year = 2025;
    dt.date.month = 10;
    dt.date.day = 31;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1761955199);
    dt.date.year = 2025;
    dt.date.month = 11;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1761955200);

#test dt2timestamp_nov_overflow
    dt.date.year = 2025;
    dt.date.month = 11;
    dt.date.day = 30;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1764547199);
    dt.date.year = 2025;
    dt.date.month = 12;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1764547200);

#tcase dt2timestamp_leap_years_feb_overflow

#test dt2timestamp_div_by_4_not_by_100
    dt.date.year = 2024;
    dt.date.month = 2;
    dt.date.day = 28;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1709164799);
    dt.date.year = 2024;
    dt.date.month = 2;
    dt.date.day = 29;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1709164800);
    dt.date.year = 2024;
    dt.date.month = 2;
    dt.date.day = 29;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1709251199);
    dt.date.year = 2024;
    dt.date.month = 3;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 1709251200);

#test dt2timestamp_div_by_400
    dt.date.year = 2000;
    dt.date.month = 2;
    dt.date.day = 28;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 951782399);
    dt.date.year = 2000;
    dt.date.month = 2;
    dt.date.day = 29;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 951782400);
    dt.date.year = 2000;
    dt.date.month = 2;
    dt.date.day = 29;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 951868799);
    dt.date.year = 2000;
    dt.date.month = 3;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 951868800);

#test dt2timestamp_div_by_100_not_by_400
    dt.date.year = 2100;
    dt.date.month = 2;
    dt.date.day = 28;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 4107542399);
    dt.date.year = 2100;
    dt.date.month = 3;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 4107542400);

#tcase dt2timestamp_neg_stamps

#test dt2timestamp_minus1
    dt.date.year = 1969;
    dt.date.month = 12;
    dt.date.day = 31;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, -1);

#test dt2timestamp_feb_29_1600
    dt.date.year = 1600;
    dt.date.month = 2;
    dt.date.day = 28;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, -11670998401);
    dt.date.year = 1600;
    dt.date.month = 2;
    dt.date.day = 29;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, -11670998400);
    dt.date.year = 1600;
    dt.date.month = 2;
    dt.date.day = 29;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, -11670912001);
    dt.date.year = 1600;
    dt.date.month = 3;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, -11670912000);

#tcase dt2timestamp_coreutils_date_range_limits
#test dt2timestamp_upper_bound
    dt.date.year = 2147485547;
    dt.date.month = 12;
    dt.date.day = 31;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 67768036191676799);
    dt.date.year = 2147485548;
    dt.date.month = 1;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, 67768036191676800);

#test dt2timestamp_lower_bound
    dt.date.year = -2147481748;
    dt.date.month = 1;
    dt.date.day = 1;
    dt.time.hours = 0;
    dt.time.minutes = 0;
    dt.time.seconds = 0;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, -67768040609740800);
    dt.date.year = -2147481749;
    dt.date.month = 12;
    dt.date.day = 31;
    dt.time.hours = 23;
    dt.time.minutes = 59;
    dt.time.seconds = 59;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, -67768040609740801);

#tcase dt2timestamp_int64_timestamp_limits
#test dt2timestamp_int64_max
    dt.date.year = 292277026596;
    dt.date.month = 12;
    dt.date.day = 4;
    dt.time.hours = 15;
    dt.time.minutes = 30;
    dt.time.seconds = 7;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, INT64_MAX);

#test dt2timestamp_int64_min
    dt.date.year = -292277022657;
    dt.date.month = 1;
    dt.date.day = 27;
    dt.time.hours = 8;
    dt.time.minutes = 29;
    dt.time.seconds = 52;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), 0);
    ck_assert_int_eq(stamp, INT64_MIN);

#tcase dt2timestamp_errors

#test dt2timestamp_null_pdt
    ck_assert_int_eq(dt2timestamp(&stamp, NULL), -1);
    ck_assert_int_eq(errno, EFAULT);

#test dt2timestamp_dt_overflow
    dt.date.year = 292277026596;
    dt.date.month = 12;
    dt.date.day = 4;
    dt.time.hours = 15;
    dt.time.minutes = 30;
    dt.time.seconds = 8;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), -1);
    ck_assert_int_eq(errno, EOVERFLOW);

#test dt2timestamp_dt_underflow
    dt.date.year = -292277022657;
    dt.date.month = 1;
    dt.date.day = 27;
    dt.time.hours = 8;
    dt.time.minutes = 29;
    dt.time.seconds = 51;
    ck_assert_int_eq(dt2timestamp(&stamp, &dt), -1);
    ck_assert_int_eq(errno, EOVERFLOW);

#test dt2timestamp_null_pstamp_is_ok
    dt.date.year = 292277026596;
    dt.date.month = 12;
    dt.date.day = 4;
    dt.time.hours = 15;
    dt.time.minutes = 30;
    dt.time.seconds = 8;
    ck_assert_int_eq(dt2timestamp(NULL, &dt), -1);
    ck_assert_int_eq(errno, EOVERFLOW);
    --dt.time.seconds;
    ck_assert_int_eq(dt2timestamp(NULL, &dt), 0);
