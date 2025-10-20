#include <regex.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *
patternsubst(
        const char *restrict pattern,
        const char *restrict orig_line,
        size_t nmatch,
        const regmatch_t *restrict pmatch
)
{
    char *res = NULL;
    char *pmem;
    regoff_t backref;
    size_t sz = pmatch[0].rm_so;
    size_t last_sz;
    size_t pattern_len = strlen(pattern);
    size_t last_idx = 0;

    if (sz && (pmem = malloc(sz)) == NULL) {
        fprintf(stderr, "Memory error: Not enough space for malloc()\n");
        return NULL;
    } else if (sz) {
        res = pmem;
        memcpy(res, orig_line, sz);
    } else {
        res = NULL;
    }

    for (size_t idx = 0; idx < pattern_len; ++idx) {
        if (pattern[idx] != '\\') {
            continue;
        }

        last_sz = sz;
        sz += idx - last_idx + (pattern[idx+1] == '\\');

        if (sz && (pmem = realloc(res, sz)) == NULL) {
            fprintf(stderr, "Memory error: Not enough space for realloc()\n");
            free(res);
            return NULL;
        } else if (sz) {
            res = pmem;
            memcpy(&res[last_sz], &pattern[last_idx], sz - last_sz);
        } else {
            res = NULL;
        }

        last_idx = idx;
        backref = pattern[++idx] - '0';

        if (1 <= backref && backref <= 9) {
            if (backref > (regoff_t) nmatch) {
                fprintf(stderr,
                        "Substitution error: Invalid back reference: \\%d\n",
                        backref);
                free(res);
                return NULL;
            }

            last_sz = sz;
            sz += pmatch[backref].rm_eo - pmatch[backref].rm_so;

            if (sz && (pmem = realloc(res, sz)) == NULL) {
                fprintf(stderr,
                        "Memory error: Not enough space for realloc()\n");
                free(res);
                return NULL;
            } else if (sz) {
                res = pmem;
                memcpy(&res[last_sz], &orig_line[pmatch[backref].rm_so],
                        sz - last_sz);
            } else {
                res = NULL;
            }

            last_idx = idx + 1;
        } else if (pattern[idx] == '\\') {
            last_idx = idx + 1;
        }
    }

    last_sz = sz;
    sz += (pattern_len - last_idx) + (strlen(orig_line) - pmatch[0].rm_eo) + 1;

    if (sz && (pmem = realloc(res, sz)) == NULL) {
        fprintf(stderr, "Memory error: Not enough space for realloc()\n");
        free(res);
        return NULL;
    } else if (sz) {
        res = pmem;
        memcpy(&res[last_sz], &pattern[last_idx], pattern_len - last_idx);
        last_sz += pattern_len - last_idx;
        memcpy(&res[last_sz], &orig_line[pmatch[0].rm_eo], sz - last_sz);
    } else {
        res = NULL;
    }

    return res;
}

int
main(int argc, char *argv[])
{
    regex_t regex;
    regmatch_t *groups;
    char *pstr;
    size_t slen;
    int rc;

    if (argc < 4) {
        fprintf(stderr, "usage: %s REGEX SUBST STR\n", argv[0]);
        return 1;
    }

    if ((rc = regcomp(&regex, argv[1], REG_EXTENDED)) != 0) {
        slen = regerror(rc, &regex, NULL, 0);
        pstr = malloc(slen);
        regerror(rc, &regex, pstr, slen);
        fprintf(stderr, "Regex compilation error %d: %s\n", rc, pstr);
        free(pstr);
        return 2;
    }

    groups = calloc(regex.re_nsub + 1, sizeof(*groups));

    if ((rc = regexec(&regex, argv[3], regex.re_nsub + 1, groups, 0)) != 0) {
        printf("%s\n", argv[3]);
        rc = 0;
    } else if ((pstr = patternsubst(argv[2], argv[3], regex.re_nsub, groups))
            != NULL) {
        printf("%s\n", pstr);
        free(pstr);
        rc = 0;
    } else {
        rc = 2;
    }

    free(groups);
    regfree(&regex);
    return rc;
}
