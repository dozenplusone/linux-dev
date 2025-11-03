#include "config.h"

#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>

#include "rhash.h"

#if HAVE_LIBREADLINE
#include <readline/readline.h>
#endif

enum { MAX_DIGEST_SIZE = 64 };

int
main(void)
{
    unsigned char digest[MAX_DIGEST_SIZE];
    char formatted_digest[2 + 2*MAX_DIGEST_SIZE];
    char *line = NULL;
    char *file_str;
    unsigned algo;

    rhash_library_init();

    do {
#if HAVE_LIBREADLINE
        if ((line = readline(NULL)) == NULL) {
            break;
        }
#else
        size_t linesz;

        if (getline(&line, &linesz, stdin) == -1) {
            break;
        }

        *strchr(line, '\n') = '\0';
#endif // HAVE_LIBREADLINE

        if ((file_str = strchr(line, ' ')) == NULL) {
            fprintf(stderr, "Invalid command format\n");
            goto ERR;
        }

        *file_str++ = '\0';

        if (!strcasecmp(line, "md5")) {
            algo = RHASH_MD5;
        } else if (!strcasecmp(line, "sha1")) {
            algo = RHASH_SHA1;
        } else if (!strcasecmp(line, "tth")) {
            algo = RHASH_TTH;
        } else {
            fprintf(stderr, "Unsupported hash algorithm\n");
            goto ERR;
        }

        if (file_str[0] == '"') {
            ++file_str;

            if (rhash_msg(algo, file_str, strlen(file_str), digest) == -1) {
                fprintf(stderr, "Failed to compute the digest\n");
                goto ERR;
            }
        } else {
            if (rhash_file(algo, file_str, digest) == -1) {
                fprintf(stderr, "Failed to compute the digest for '%s': %s\n",
                        file_str, strerror(errno));
                goto ERR;
            }
        }

        rhash_print_bytes(formatted_digest, digest,
                rhash_get_digest_size(algo),
                'a' <= line[0] && line[0] <= 'z' ? RHPR_BASE64 : RHPR_HEX);
        printf("%s\n", formatted_digest);
ERR:
        free(line);
        line = NULL;
    } while (1);

    free(line);
    return 0;
}
