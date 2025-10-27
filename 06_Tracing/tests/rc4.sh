TRUETXT=$(mktemp)
SRCFILE=$(mktemp)
DSTFILE=${SRCFILE}.new
ERRTEXT="$(basename $1): cannot open '${SRCFILE}': Bad file descriptor"

clean() {
    trap - EXIT
    rm -f ${TRUETXT} ${SRCFILE}
}

trap clean EXIT HUP INT QUIT PIPE TERM

strace -efault=openat:error=EBADF -P ${SRCFILE} $1 ${SRCFILE} ${DSTFILE} > ${TRUETXT} 2>&1
test $? -eq 4 -a -f ${SRCFILE} -a ! -f ${DSTFILE} && grep -F "${ERRTEXT}" ${TRUETXT} > /dev/null 2>&1
exit $?
