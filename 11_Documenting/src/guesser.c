#include "config.h"

#include <libintl.h>
#include <locale.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define _(STR) gettext(STR)

char *
int2roman(int n)
{
    static const char letters[] = "IXCMVLD";
    char *ans = NULL;
    int len = 0;
    int pos = sizeof(letters) - 1;
    int den = 1000;

    if (n < 1 || n > 3999) {
        return NULL;
    }

    ans = calloc(sizeof("MMMDCCCLXXXVIII"), 1);

    do {
        int dig = n / den;

        if (dig == 9) {
            ans[len++] = letters[pos - 4];
            ans[len++] = letters[pos - 3];
        } else if (dig == 4) {
            ans[len++] = letters[pos - 4];
            ans[len++] = letters[pos];
        } else {
            if (dig >= 5) {
                ans[len++] = letters[pos];
                dig -= 5;
            }

            while (dig--) {
                ans[len++] = letters[pos - 4];
            }
        }

        --pos;
        n %= den;
        den /= 10;
    } while (den);

    return realloc(ans, len + 1);
}

int
roman2int(const char *str)
{
    static char letters[] = "MDCLXVI";
    unsigned long pos = 0;
    unsigned long len;
    unsigned long count;
    int factor = 100;
    int ans = 0;
    char tmp;

    if (!str || !(len = strlen(str))) {
        return 0;
    }

    if ((count = strspn(str, "M")) > 3) {
        return -1;
    }

    ans += 1000 * count;
    str += count;
    len -= count;

    do {
        tmp = letters[pos + 3];
        letters[pos + 3] = '\0';
        count = strspn(str, letters + pos);

        if (str[0] == letters[pos + 2] && str[1] == letters[pos]
                && count == 2) {
            ans += 9 * factor;
        } else if (str[0] == letters[pos + 2] && str[1] == letters[pos + 1]
                && count == 2) {
            ans += 4 * factor;
        } else if (count > 0) {
            if (str[0] == letters[pos + 1]) {
                ans += 5 * factor;
                ++str;
                --len;
                --count;
            }

            if (strspn(str, letters + pos + 2) == count && count <= 3) {
                ans += count * factor;
            } else {
                letters[pos + 3] = tmp;
                return -1;
            }
        }

        str += count;
        len -= count;
        letters[pos + 3] = tmp;
        pos += 2;
        factor /= 10;
    } while (factor);

    return len ? -1 : ans;
}

int
main(void)
{
    char *input = NULL;
    size_t sz;
    int lo = 1;
    int hi = 3999;
    int ans;

    setlocale(LC_ALL, "");
    bindtextdomain(PACKAGE, LOCALE_PATH);
    textdomain(PACKAGE);

    printf(_("Pick a natural number between %d and %d and press Enter. "),
            lo, hi);

    if (getline(&input, &sz, stdin) == -1) {
        free(input);
        putchar('\n');
        return 1;
    }

    do {
        free(input);
        input = NULL;

        ans = (lo + hi) >> 1;
        printf(_("Is the number not greater than %d? [yes/no] "), ans);

        if (getline(&input, &sz, stdin) == -1) {
            free(input);
            putchar('\n');
            return 1;
        }

        if (!strcmp(input, _("yes\n"))) {
            hi = ans;
        } else if (!strcmp(input, _("no\n"))) {
            lo = ++ans;
        }
    } while (ans != lo || ans != hi);

    free(input);
    printf(_("The answer is %d.\n"), ans);
    return 0;
}
