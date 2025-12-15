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

/** Check if a datetime at `pdt` is valid.
 *
 * @param[in] pdt pointer to the datetime being checked
 *
 * @result
 * On success, 0 is returned.
 * Otherwise, -1 is returned, and `errno` is set to indicate the error.
 *
 * @section Errors
 * @b EFAULT @param pdt is invalid
 */
int
dtcheck(utc_datetime_t *pdt);

/** Get day of the week by date.
 *
 * @param[in] pd pointer to the date
 *
 * @result
 * On success, the day of the week is returned.
 * Otherwise, -1 is returned, and `errno` is set to indicate the error.
 *
 * @section Errors
 * @b EFAULT @param pdt is invalid
 */
weekday_t
get_weekday(utc_date_t *pd);

/** Convert Unix timestamp to datetime.
 *
 * @param[in] stamp pointer to the date
 * @param[out] pdt pointer to the datetime
 *
 * @result
 * On success, 0 is returned.
 * Otherwise, -1 is returned, and `errno` is set to indicate the error.
 *
 * @section Errors
 * @b EFAULT @param pdt is invalid
 */
int
timestamp2dt(int64_t stamp, utc_datetime_t *pdt);

/** Convert datetime to Unix timestamp.
 *
 * @param[out] pstamp pointer to the stamp; may be NULL
 * just to check if conversion is possible
 * @param[in] pdt pointer to the datetime
 *
 * @result
 * On success, 0 is returned.
 * Otherwise, -1 is returned, and `errno` is set to indicate the error.
 *
 * @section Errors
 * @b EFAULT @param pdt is invalid
 * @b EOVERFLOW the datetime's timestamp cannot fit in 64 bits
 */
int
dt2timestamp(int64_t *pstamp, utc_datetime_t *pdt);

#ifdef __cplusplus
}
#endif

#endif /* DATE_H */
