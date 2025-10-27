#include <dlfcn.h>
#include <errno.h>
#include <string.h>

static int (*true_unlink)(const char *) = NULL;

int unlink(const char *name)
{
    if (true_unlink == NULL) {
        true_unlink = dlsym(RTLD_NEXT, "unlink");
    }

    if (strstr(name, "PROTECT") == NULL) {
        return true_unlink(name);
    }

    errno = EBADRQC;
    return -1;
}
