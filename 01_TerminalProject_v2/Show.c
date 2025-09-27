#include <fcntl.h>
#include <locale.h>
#include <ncurses.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

#define min(x, y) ((x) < (y) ? (x) : (y))

typedef struct screenstate_s
{
    WINDOW *screen;
    uint8_t *data;
    char **lines;
    size_t *linelen;
    size_t line0;
    size_t linemax;
    size_t col0;
    size_t colmax;
    size_t linefmtlen;
    uint8_t linenum_enabled;
} screenstate_t;

static screenstate_t *
openscreen(const char *path, int lines, int cols, int y, int x)
{
    screenstate_t *ss = calloc(1, sizeof(*ss));
    int fd = open(path, O_RDONLY);
    struct stat st;
    size_t ln_idx = 0;
    size_t len;

    fstat(fd, &st);
    ss->data = malloc(st.st_size + 1);
    read(fd, ss->data, st.st_size);
    close(fd);
    ss->data[st.st_size] = '\0';

    ss->screen = newwin(lines, cols, y, x),
    keypad(ss->screen, TRUE);

    ss->lines = NULL;
    ss->linelen = NULL;

    do {
        if ((len = strcspn(&ss->data[ln_idx], "\n")) > ss->colmax) {
            ss->colmax = len;
        };

        ++ss->linemax;

        ss->lines = realloc(ss->lines, ss->linemax * sizeof(*ss->lines));
        ss->lines[ss->linemax - 1] = &ss->data[ln_idx];

        ss->linelen = realloc(ss->linelen, ss->linemax * sizeof(*ss->linelen));
        ss->linelen[ss->linemax - 1] = len;

        ln_idx += len;
        ss->data[ln_idx++] = '\0';
    } while (ln_idx < st.st_size);

    len = ss->linemax;

    do {
        ++ss->linefmtlen;
        len /= 10;
    } while (len);

    return ss;
}

static void
refreshscreen(screenstate_t *ss)
{
    int lines;
    int cols;

    getmaxyx(ss->screen, lines, cols);
    werase(ss->screen);

    for (size_t ln = 0; ln < min(lines, ss->linemax - ss->line0); ++ln) {
        if (ss->linenum_enabled) {
            if (ss->col0 < ss->linelen[ss->line0 + ln]) {
                mvwprintw(ss->screen, ln, 0, "%*zu:  %.*s",
                        ss->linefmtlen, ss->line0 + ln + 1,
                        cols - ss->linefmtlen - 3,
                        &ss->lines[ss->line0 + ln][ss->col0]);
            } else {
                mvwprintw(ss->screen, ln, 0, "%*zu:",
                        ss->linefmtlen, ss->line0 + ln + 1);
            }
        } else if (ss->col0 < ss->linelen[ss->line0 + ln]) {
            mvwprintw(ss->screen, ln, 0, "%.*s", cols,
                    &ss->lines[ss->line0 + ln][ss->col0]);
        }
    }

    wrefresh(ss->screen);
}

static void
closescreen(screenstate_t *ss)
{
    free(ss->lines);
    free(ss->data);
    delwin(ss->screen);
    free(ss);
}

int
main(int argc, char *argv[])
{
    screenstate_t *scr = NULL;
    size_t coldef;
    int ch;

    setlocale(LC_ALL, "");
    initscr();
    noecho();
    cbreak();

    scr = openscreen(argv[1], LINES - 2, COLS - 2, 1, 1);

    do {
        coldef = scr->linenum_enabled ? scr->linefmtlen + 5 : 2;
        box(stdscr, 0, 0);
        mvprintw(0, 2, "[ %s / lines %zu-%zu / columns %zu-%zu ]", argv[1],
                scr->line0 + 1, min(scr->line0 + LINES - 2, scr->linemax),
                scr->col0 + 1, min(scr->col0 + COLS - coldef, scr->colmax));
        move(0, 0);
        refresh();
        refreshscreen(scr);
        refresh();

        switch (ch = wgetch(scr->screen)) {
        case KEY_DOWN: case ' ':
            if (scr->line0 + LINES - 2 < scr->linemax) {
                ++scr->line0;
            }
            break;
        case KEY_UP:
            if (scr->line0) {
                --scr->line0;
            }
            break;
        case KEY_RIGHT:
            if (scr->col0 + COLS - coldef < scr->colmax) {
                ++scr->col0;
            }
            break;
        case KEY_LEFT:
            if (scr->col0) {
                --scr->col0;
            }
            break;
        case KEY_NPAGE:
            scr->line0 = min(scr->line0 + LINES - 2, scr->linemax - LINES + 2);
            break;
        case KEY_PPAGE:
            if (scr->line0 > LINES - 2) {
                scr->line0 -= LINES - 2;
            } else {
                scr->line0 = 0;
            }
            break;
        case 'n': case 'N':
            if (COLS - scr->linefmtlen > 5) {
                scr->linenum_enabled = !scr->linenum_enabled;
            }
            break;
        }
    } while (ch != 0x1b && ch != 'q' && ch != 'Q');

    closescreen(scr);
    endwin();
    return 0;
}
