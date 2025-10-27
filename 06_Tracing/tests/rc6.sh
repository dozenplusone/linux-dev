TRUETXT=$(mktemp)
SRCFILE=$(mktemp)
DSTFILE=${SRCFILE}.new

clean() {
    trap - EXIT
    rm -f ${TRUETXT} ${SRCFILE}
}

trap clean EXIT HUP INT QUIT PIPE TERM

cat /etc/passwd > ${SRCFILE}
ERRTEXT="$(basename $1): cannot read $(stat --format %s ${SRCFILE}) bytes from '${SRCFILE}': Operation not permitted"

strace -efault=read:error=EPERM -P ${SRCFILE} $1 ${SRCFILE} ${DSTFILE} > ${TRUETXT} 2>&1
test $? -eq 6 -a -f ${SRCFILE} -a ! -f ${DSTFILE} && grep -F "${ERRTEXT}" ${TRUETXT} > /dev/null 2>&1
exit $?
