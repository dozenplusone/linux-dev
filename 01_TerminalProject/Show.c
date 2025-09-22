#include <ctype.h>
#include <errno.h>
#include <locale.h>
#include <ncurses.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int
waddstr_f(WINDOW *restrict win, FILE *restrict stream)
{
    int rc = ERR;
    char *line = NULL;
    char *lf_pos;
    int lines;
    int cols;

    getmaxyx(win, lines, cols);
    line = calloc(cols + 1, sizeof(*line));

    if (fgets(line, cols + 1, stream)) {
        if (!!(lf_pos = strchr(line, '\n'))) {
            *lf_pos = '\0';
        }

        if (isgraph(line[cols - 1])) {
            ungetc(line[cols - 1], stream);
        }

        line[cols - 1] = '\0';
        rc = wprintw(win, "\n%s", line);
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
    move(1, 0);

    for (int ln = 0; ln < LINES - 2; ++ln) {
        if (waddstr_f(view, file) == ERR) {
            break;
        }
    }

    for (int ch = wgetch(view); ch != 0x1b; ch = wgetch(view)) {
        switch (ch) {
        case 0x20:
            waddstr_f(view, file);
            break;
        }
    }

    delwin(view);
    delwin(frame);
    endwin();
    fclose(file);
    return 0;
}
