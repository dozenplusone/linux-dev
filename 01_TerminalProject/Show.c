#include <errno.h>
#include <locale.h>
#include <ncurses.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int
wprintw_f(WINDOW *restrict win, FILE *restrict stream)
{
    int rc = ERR;
    char *line = NULL;
    size_t sz;

    if (getline(&line, &sz, stream) > 0) {
        rc = wprintw(win, line);
    }

    free(line);
    return rc;
}

int
main(int argc, char *argv[])
{
    WINDOW *frame = NULL;
    WINDOW *view = NULL;
    FILE *file = NULL;

    if (!(argv[1] && strcmp(argv[1], "-h") && strcmp(argv[1], "--help"))) {
        fprintf(stderr, "Usage: %s <file>\n", argv[0]);

        if (argv[1]) {
            fprintf(stderr,
                    "\n\tA simple text file viewer.\n\n"
                    "Return codes:\n"
                    "\t0:\tSuccessful exit.\n"
                    "\t1:\tNo file specified.\n"
                    "\t2:\tError opening the file.\n");
            return 0;
        }

        return 1;
    }

    if (!(file = fopen(argv[1], "r"))) {
        fprintf(stderr, "Error opening '%s': [Errno %d] %s\n",
                argv[1], errno, strerror(errno));
        return 2;
    }

    setlocale(LC_ALL, "");
    initscr();
    cbreak();
    noecho();
    refresh();

    frame = newwin(LINES, COLS, 0, 0);
    box(frame, 0, 0);
    mvwaddstr(frame, 0, (COLS - strlen(argv[1])) >> 1, argv[1]);
    wrefresh(frame);

    view = newwin(LINES - 2, COLS - 2, 1, 1);
    keypad(view, TRUE);
    scrollok(view, TRUE);

    for (int ln = 0; ln < LINES - 3; ++ln) {
        if (wprintw_f(view, file) == ERR) {
            break;
        }
    }

    for (int ch = wgetch(view); ch != 0x1b; ch = wgetch(view)) {
        switch (ch) {
        case 0x20:
            wprintw_f(view, file);
            break;
        }
    }

    delwin(view);
    delwin(frame);
    endwin();
    fclose(file);
    return 0;
}
