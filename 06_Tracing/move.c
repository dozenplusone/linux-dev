#include <fcntl.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <unistd.h>

int
main(int argc, char *argv[])
{
    struct stat st;
    unsigned char *buf = NULL;
    int fd = -1;

    if (argc < 3) {
        return 1;
    }

    fd = open(argv[1], O_RDONLY);
    fstat(fd, &st);
    buf = malloc(st.st_size);
    read(fd, buf, st.st_size);
    close(fd);

    fd = open(argv[2], O_WRONLY | O_CREAT | O_TRUNC, st.st_mode);
    write(fd, buf, st.st_size);
    free(buf);
    close(fd);

    unlink(argv[1]);
    return 0;
}
