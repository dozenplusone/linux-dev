#include <dlfcn.h>
#include <errno.h>
#include <string.h>

int unlink(const char *name)
{
    int (*true_unlink)(const char *) = dlsym(RTLD_NEXT, "unlink");

    if (strstr(name, "PROTECT") == NULL) {
        return true_unlink(name);
    }

    errno = EBADRQC;
    return -1;
}
