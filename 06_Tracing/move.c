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
        return 1;
    }

    stat(argv[1], &st_in);

    if (stat(argv[2], &st_out) == 0 && st_out.st_ino == st_in.st_ino) {
        return 2;
    }

    fd = open(argv[1], O_RDONLY);
    buf = malloc(st_in.st_size);
    read(fd, buf, st_in.st_size);
    close(fd);

    fd = open(argv[2], O_WRONLY | O_CREAT | O_TRUNC, st_in.st_mode);
    write(fd, buf, st_in.st_size);
    free(buf);
    close(fd);

    unlink(argv[1]);
    return 0;
}
