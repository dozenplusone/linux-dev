#ifndef DATE_H
#define DATE_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

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

int
timestamp2dt(int64_t stamp, utc_datetime_t *pdt);

#ifdef __cplusplus
}
#endif

#endif /* DATE_H */
