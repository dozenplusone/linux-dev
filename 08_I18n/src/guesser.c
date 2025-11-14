#include "config.h"

#include <libintl.h>
#include <locale.h>
#include <stdio.h>

#define _(STR) gettext(STR)

int
main(void)
{
    int lo = 1;
    int hi = 100;
    int ans;
    char ch;

    setlocale(LC_ALL, "");
    bindtextdomain(PACKAGE, LOCALE_PATH);
    textdomain(PACKAGE);

    printf(_("Pick a natural number between 1 and 100 and press Enter. "));

    do {
        if (scanf("%c", &ch) == -1) {
            putchar('\n');
            return 1;
        }
    } while (ch != '\n');

    do {
        ans = (lo + hi) >> 1;

        do {
            printf(_("Is the number not greater than %d? [y/n] "), ans);

            if (scanf(" %c", &ch) == -1) {
                putchar('\n');
                return 1;
            }
        } while (ch != 'y' && ch != 'Y' && ch != 'n' && ch != 'N');

        if (ch == 'y' || ch == 'Y') {
            hi = ans;
        } else {
            lo = ++ans;
        }
    } while (ans != lo || ans != hi);

    printf(_("The answer is %d.\n"), ans);
    return 0;
}
