#include <err.h>
#include <fcntl.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <unistd.h>

int
main(int argc, char *argv[])
{
    struct stat st_in;
    struct stat st_out;
    unsigned char *buf = NULL;
    int fd = -1;

    if (argc < 3) {
        errx(1, "usage: %s infile outfile", argv[0]);
    }

    if (stat(argv[1], &st_in) == -1) {
        err(2, "cannot stat '%s'", argv[1]);
    }

    if (stat(argv[2], &st_out) == 0 && st_out.st_ino == st_in.st_ino) {
        errx(3, "'%s' and '%s' are the same file", argv[1], argv[2]);
    }

    if ((fd = open(argv[1], O_RDONLY)) == -1) {
        err(4, "cannot open '%s'", argv[1]);
    }

    if (st_in.st_size > 0 && (buf = malloc(st_in.st_size)) == NULL) {
        warn("cannot allocate %zd bytes for reading", st_in.st_size);
        close(fd);
        return 5;
    }

    if (read(fd, buf, st_in.st_size) != st_in.st_size) {
        warn("cannot read %zd bytes from '%s'", st_in.st_size, argv[1]);
        free(buf);
        close(fd);
        return 6;
    }

    if (close(fd) == -1) {
        warn("cannot close '%s'", argv[1]);
        free(buf);
        return 8;
    }

    if ((fd = open(argv[2], O_WRONLY | O_CREAT | O_TRUNC,
            st_in.st_mode)) == -1) {
        warn("cannot open '%s'", argv[2]);
        free(buf);
        return 4;
    }

    if (write(fd, buf, st_in.st_size) != st_in.st_size) {
        warn("cannot write %zd bytes to '%s'", st_in.st_size, argv[2]);
        free(buf);
        close(fd);
        unlink(argv[2]);
        return 7;
    }

    free(buf);

    if (close(fd) == -1) {
        warn("cannot close '%s'", argv[2]);
        unlink(argv[2]);
        return 8;
    }

    if (unlink(argv[1]) == -1) {
        warn("cannot unlink '%s'", argv[1]);
        unlink(argv[2]);
        return 9;
    }

    return 0;
}
