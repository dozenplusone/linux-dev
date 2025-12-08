/** @mainpage guesser
 * A simple program trying to guess a picked number
 *
 * @section SYNOPSIS
 * `guesser [-h | --help | -r]`
 *
 * @section DESCRIPTION
 * The program tries to guess the picked number between 1 and 3999
 * by asking whether the number is not greater than the current guess.
 *
 * @b -r
 * @n print numerals in Roman
 *
 * @b -h, @b --help
 * @n display the program's help and exit
 */
#include "config.h"
#include "roman.h"

#include <libintl.h>
#include <locale.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define _(STR) gettext(STR)

int
main(int argc, char *argv[])
{
    char *input = NULL;
    char *roman = NULL;
    size_t sz;
    int lo = 1;
    int hi = 3999;
    int ans;
    unsigned char is_roman = 0;

    setlocale(LC_ALL, "");
    bindtextdomain(PACKAGE, LOCALE_PATH);
    textdomain(PACKAGE);

    if (argc > 1) {
        if (!strcmp(argv[1], "-r")) {
            is_roman = 1;
        } else if (!strcmp(argv[1], "-h") || !strcmp(argv[1], "--help")) {
            printf(_(
                "Usage: %s [-h | --help | -r]\n"
                "Guess a picked number.\n"
                "\n"
                "  -r                print numerals in Roman\n"
                "  -h, --help        display this help and exit\n"
            ), argv[0]);
            return 0;
        } else {
            printf(_(
                "%1$s: invalid option -- '%2$s'\n"
                "Try '%1$s --help' for more information.\n"
            ), argv[0], argv[1]);
            return 1;
        }
    }

    if (is_roman) {
        char *lo_roman = int2roman(lo);
        char *hi_roman = int2roman(hi);

        printf(_("Pick a natural number between %s and %s and press Enter. "),
                lo_roman, hi_roman);
        free(lo_roman);
        free(hi_roman);
    } else {
        printf(_("Pick a natural number between %d and %d and press Enter. "),
                lo, hi);
    }

    if (getline(&input, &sz, stdin) == -1) {
        free(input);
        putchar('\n');
        return 1;
    }

    do {
        free(input);
        input = NULL;
        ans = (lo + hi) >> 1;

        if (is_roman) {
            roman = int2roman(ans);
            printf(_("Is the number not greater than %s? [yes/no] "), roman);
            free(roman);
        } else {
            printf(_("Is the number not greater than %d? [yes/no] "), ans);
        }

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

    if (is_roman) {
        roman = int2roman(ans);
        printf(_("The answer is %s.\n"), roman);
        free(roman);
    } else {
        printf(_("The answer is %d.\n"), ans);
    }

    free(input);
    return 0;
}
