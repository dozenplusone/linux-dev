/** @mainpage Date/time conversion routines
 *
 * Convert datetime into Unix timestamp and vice versa.
 *
 * Get day of the week by any date
 * (proleptic Gregorian calendar is used).
 */
#ifndef DATE_H
#define DATE_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef enum weekday_e
{
    INVALID_WEEKDAY = -1,
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
} weekday_t;

typedef struct utc_date_s
{
    int64_t year: 48;
    uint8_t month;
    uint8_t day;
} utc_date_t;

typedef struct utc_time_s
{
    uint8_t hours;
    uint8_t minutes;
    uint8_t seconds;
} utc_time_t;

typedef struct utc_datetime_s
{
    utc_date_t date;
    utc_time_t time;
} utc_datetime_t;

/** @brief check datetime sanity
 *
 * @code
 * #include <utcdate.h>
 * int
 * dtcheck(utc_datetime_t *pdt);
 * @endcode
 *
 * @details Check if the datetime at `pdt` is in valid ranges.
 *
 * @param[in] pdt pointer to the datetime
 *
 * @result
 * On success, 0 is returned if all fields are in their valid ranges,
 * or 1 if some fields contain invalid value.
 * Otherwise, -1 is returned, and `errno` is set to indicate the error.
 *
 * @par Errors
 * @b EFAULT
 * @n `pdt` is an invalid pointer.
 */
int
dtcheck(utc_datetime_t *pdt);

/** @brief get day of the week
 *
 * @code
 * #include <utcdate.h>
 * weekday_t
 * get_weekday(utc_date_t *pd);
 * @endcode
 *
 * @details Get day of the week by date at `pd`.
 *
 * @param[in] pd pointer to the date
 *
 * @result
 * On success, the day of the week is returned.
 * Otherwise, -1 is returned, and `errno` is set to indicate the error.
 *
 * @par Errors
 * @b EFAULT
 * @n `pd` is an invalid pointer.
 */
weekday_t
get_weekday(utc_date_t *pd);

/** @brief convert Unix timestamp to datetime
 *
 * @code
 * #include <utcdate.h>
 * int
 * timestamp2dt(int64_t stamp, utc_datetime_t *pdt);
 * @endcode
 *
 * @details Convert timestamp `stamp` into a datetime stored in `pdt`.
 * The Unix timestamp is the number of seconds
 * since 1970-01-01 00:00:00 UTC.
 *
 * @param[in] stamp Unix epoch time
 * @param[out] pdt pointer to the datetime
 *
 * @result
 * On success, 0 is returned.
 * Otherwise, -1 is returned, and `errno` is set to indicate the error.
 *
 * @par Errors
 * @b EFAULT
 * @n `pdt` is an invalid pointer.
 */
int
timestamp2dt(int64_t stamp, utc_datetime_t *pdt);

/** @brief convert datetime to Unix timestamp
 *
 * @code
 * #include <utcdate.h>
 * int
 * dt2timestamp(int64_t *pstamp, utc_datetime_t *pdt);
 * @endcode
 *
 * @details Convert a datetime at `pdt`
 * into a timestamp stored in `pstamp`.
 * The Unix timestamp is the number of seconds
 * since 1970-01-01 00:00:00 UTC.
 *
 * @param[out] pstamp pointer to the stamp;
 * may be NULL just to check if conversion is possible
 * @param[in] pdt pointer to the datetime
 *
 * @result
 * On success, 0 is returned.
 * Otherwise, -1 is returned, and `errno` is set to indicate the error.
 *
 * @par Errors
 * @b EFAULT
 * @n `pdt` is an invalid pointer. @n
 * @b EOVERFLOW
 * @n The resulting timestamp is not representable in an integer.
 */
int
dt2timestamp(int64_t *pstamp, utc_datetime_t *pdt);

#ifdef __cplusplus
}
#endif

#endif /* DATE_H */
