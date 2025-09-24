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
    size_t line0;
    size_t linemax;
} screenstate_t;

static screenstate_t *
openscreen(const char *path, int lines, int cols, int y, int x)
{
    screenstate_t *ss = calloc(1, sizeof(*ss));
    int fd = open(path, O_RDONLY);
    struct stat st;
    size_t ln_idx = 0;

    fstat(fd, &st);
    ss->data = malloc(st.st_size);
    read(fd, ss->data, st.st_size);
    close(fd);

    ss->screen = newwin(lines, cols, y, x),
    keypad(ss->screen, TRUE);

    ss->lines = NULL;

    do {
        ss->lines = realloc(ss->lines, ++ss->linemax * sizeof(*ss->lines));
        ss->lines[ss->linemax - 1] = &ss->data[ln_idx];
        ln_idx += strcspn(&ss->data[ln_idx], "\n");
        ss->data[ln_idx++] = '\0';
    } while (ln_idx < st.st_size);

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
        mvwprintw(ss->screen, ln, 0, "%.*s", cols, ss->lines[ss->line0 + ln]);
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
    int ch;

    setlocale(LC_ALL, "");
    initscr();
    noecho();
    cbreak();

    scr = openscreen(argv[1], LINES - 2, COLS - 2, 1, 1);

    do {
        box(stdscr, 0, 0);
        mvprintw(0, 2, "[ %s / lines %zu-%zu ]", argv[1],
                scr->line0 + 1, min(scr->line0 + LINES - 2, scr->linemax));
        move(0, 0);
        refresh();
        refreshscreen(scr);
        refresh();

        switch (ch = wgetch(scr->screen)) {
        case 0x20:
            if (scr->line0 + LINES - 2 < scr->linemax) {
                ++scr->line0;
            }
            break;
        }
    } while (ch != 0x1b);

    closescreen(scr);
    endwin();
    return 0;
}
