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
main(void)
{
    char *input = NULL;
    size_t sz;
    int lo = 1;
    int hi = 100;
    int ans;

    setlocale(LC_ALL, "");
    bindtextdomain(PACKAGE, LOCALE_PATH);
    textdomain(PACKAGE);

    printf(_("Pick a natural number between 1 and 100 and press Enter. "));

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
