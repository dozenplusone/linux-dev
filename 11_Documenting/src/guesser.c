#include "config.h"

#include <libintl.h>
#include <locale.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define _(STR) gettext(STR)

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
