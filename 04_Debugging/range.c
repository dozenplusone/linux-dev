#include <stdio.h>
#include <stdlib.h>

typedef struct range
{
    int start;
    int stop;
    int step;
    int _curval;
} range;

void
range_init(range *pr)
{
    pr->_curval = pr->start;
}

int
range_run(range *pr)
{
    return pr->step > 0 && pr->_curval < pr->stop
            || pr->step < 0 && pr->_curval > pr->stop
            || pr->step == 0 && pr->_curval != pr->stop;
}

void
range_next(range *pr)
{
    pr->_curval += pr->step;
}

int
range_get(range *pr)
{
    return pr->_curval;
}

void
argparse(int argc, char *argv[], int *pstart, int *pstop, int *pstep)
{
    if (argc <= 1) {
        printf("usage: %s [STOP | START STOP [STEP]]\n", argv[0]);
        exit(0);
    } else if (argc == 2) {
        *pstart = 0;
        *pstop = atoi(argv[1]);
        *pstep = 1;
    } else if (argc == 3) {
        *pstart = atoi(argv[1]);
        *pstop = atoi(argv[2]);
        *pstep = 1;
    } else {
        *pstart = atoi(argv[1]);
        *pstop = atoi(argv[2]);
        *pstep = atoi(argv[3]);
    }
}

int main(int argc, char *argv[]) {
    range I;
    argparse(argc, argv, &I.start, &I.stop, &I.step);
    for(range_init(&I); range_run(&I); range_next(&I))
        printf("%d\n", range_get(&I));
    return 0;
}
