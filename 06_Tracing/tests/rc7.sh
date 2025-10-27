TRUETXT=$(mktemp)
SRCFILE=$(mktemp)
DSTFILE=${SRCFILE}.new

clean() {
    trap - EXIT
    rm -f ${TRUETXT} ${SRCFILE}
}

trap clean EXIT HUP INT QUIT PIPE TERM

cat /etc/passwd > ${SRCFILE}
ERRTEXT="$(basename $1): cannot write $(stat --format %s ${SRCFILE}) bytes to '${DSTFILE}': Text file busy"

strace -efault=write:error=ETXTBSY -P ${DSTFILE} $1 ${SRCFILE} ${DSTFILE} > ${TRUETXT} 2>&1
test $? -eq 7 -a -f ${SRCFILE} -a ! -f ${DSTFILE} && grep -F "${ERRTEXT}" ${TRUETXT} > /dev/null 2>&1
exit $?
