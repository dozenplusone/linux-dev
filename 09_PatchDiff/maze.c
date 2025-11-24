#include <stdio.h>
#include <stdlib.h>
#include <time.h>

enum { MAZE_SIZE = 6 };

char **
generate_maze(void)
{
    enum
    {
        UP_BIT = 0x1,
        DOWN_BIT = 0x2,
        LEFT_BIT = 0x4,
        RIGHT_BIT = 0x8
    };

    typedef struct cell_info_s
    {
        int row_prev;
        int col_prev;
        unsigned char visited;
    } cell_info_t;

    char **maze = NULL;
    cell_info_t **info = NULL;
    cell_info_t *last;
    int row;
    int col;
    unsigned char dir;

    maze = calloc(2*MAZE_SIZE + 1, sizeof(*maze));

    for (row = 0; row <= 2 * MAZE_SIZE; ++row) {
        maze[row] = calloc(2*MAZE_SIZE + 1, sizeof(*maze[row]));

        for (col = 0; col <= 2 * MAZE_SIZE; ++col) {
            maze[row][col] = (row & 1) && (col & 1) ? '.' : '#';
        }
    }

    info = calloc(MAZE_SIZE, sizeof(*info));

    for (row = 0; row < MAZE_SIZE; ++row) {
        info[row] = calloc(MAZE_SIZE, sizeof(*info[row]));
    }

    row = rand() % MAZE_SIZE;
    col = rand() % MAZE_SIZE;
    info[row][col].row_prev = -1;
    info[row][col].col_prev = -1;

    do {
        info[row][col].visited = 1;
        dir = (row != 0 && !info[row - 1][col].visited)
                | (row != MAZE_SIZE - 1 && !info[row + 1][col].visited) << 1
                | (col != 0 && !info[row][col - 1].visited) << 2
                | (col != MAZE_SIZE - 1 && !info[row][col + 1].visited) << 3;

        if (!dir) {
            last = &info[row][col];
            row = last->row_prev;
            col = last->col_prev;
            continue;
        }

        while (dir & (dir - 1)) {
            dir &= ~(1 << (rand() & 3));
        }

        switch (dir) {
        case UP_BIT:
            maze[2*row][2*col + 1] = '.';
            info[row - 1][col].row_prev = row;
            info[row - 1][col].col_prev = col;
            --row;
            break;
        case DOWN_BIT:
            maze[2*row + 2][2*col + 1] = '.';
            info[row + 1][col].row_prev = row;
            info[row + 1][col].col_prev = col;
            ++row;
            break;
        case LEFT_BIT:
            maze[2*row + 1][2*col] = '.';
            info[row][col - 1].row_prev = row;
            info[row][col - 1].col_prev = col;
            --col;
            break;
        case RIGHT_BIT:
            maze[2*row + 1][2*col + 2] = '.';
            info[row][col + 1].row_prev = row;
            info[row][col + 1].col_prev = col;
            ++col;
            break;
        }
    } while (info[row][col].row_prev != -1);

    for (row = 0; row < MAZE_SIZE; ++row) {
        free(info[row]);
    }

    free(info);
    return maze;
}

int
main(void)
{
    char **maze = NULL;
    int i;

    srand(time(NULL));
    maze = generate_maze();

    for (i = 0; i <= 2 * MAZE_SIZE; ++i) {
        printf("%.*s\n", 2 * MAZE_SIZE + 1, maze[i]);
        free(maze[i]);
    }

    free(maze);
    return 0;
}
