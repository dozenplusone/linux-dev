#include "buf.h"

#include <check.h>

float *a = NULL;
long *ai = NULL;

#suite unittest

#tcase basic

#test init_push_clear_free
    ck_assert_uint_eq(buf_capacity(a), 0);
    ck_assert_uint_eq(buf_size(a), 0);
    buf_push(a, 1.3f);
    ck_assert_uint_eq(buf_size(a), 1);
    ck_assert_float_eq(a[0], 1.3f);
    buf_clear(a);
    ck_assert_uint_eq(buf_size(a), 0);
    ck_assert_ptr_nonnull(a);
    buf_free(a);
    ck_assert_ptr_null(a);

#test clear_empty
    buf_clear(a);
    ck_assert_uint_eq(buf_size(a), 0);
    ck_assert_ptr_null(a);

#tcase ops

void
ops_teardown(void)
{
    buf_free(a);
    buf_free(ai);
}

#test push_
    for (int i = 0; i < 10000; i++) {
        buf_push(ai, i);
    }
    ck_assert_uint_eq(buf_size(ai), 10000);
    size_t match = 0;
    for (size_t i = 0; i < buf_size(ai); i++) {
        match += ai[i] == i;
    }
    ck_assert_uint_eq(match, 10000);

#test grow_trunc
    buf_grow(ai, 1000);
    ck_assert_uint_eq(buf_capacity(ai), 1000);
    ck_assert_uint_eq(buf_size(ai), 0);
    buf_trunc(ai, 100);
    ck_assert_uint_eq(buf_capacity(ai), 100);

#test pop_
    buf_push(a, 1.1);
    buf_push(a, 1.2);
    buf_push(a, 1.3);
    buf_push(a, 1.4);
    ck_assert_uint_eq(buf_size(a), 4);
    ck_assert_float_eq(buf_pop(a), 1.4f);
    buf_trunc(a, 3);
    ck_assert_uint_eq(buf_size(a), 3);
    ck_assert_float_eq(buf_pop(a), 1.3f);
    ck_assert_float_eq(buf_pop(a), 1.2f);
    ck_assert_float_eq(buf_pop(a), 1.1f);
    ck_assert_uint_eq(buf_size(a), 0);

#main-pre
    tcase_add_checked_fixture(tc1_2, NULL, ops_teardown);
