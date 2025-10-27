TRUETXT=$(mktemp)
SRCFILE=PROTECT.txt
DSTFILE=new.txt
ERRTEXT="$(basename $1): cannot unlink '${SRCFILE}': Invalid request code"

clean() {
    trap - EXIT
    rm -f ${TRUETXT} ${SRCFILE}
}

trap clean EXIT HUP INT QUIT PIPE TERM

echo "Protected file" > ${SRCFILE}
LD_PRELOAD=$(realpath $2) $1 ${SRCFILE} ${DSTFILE} > ${TRUETXT} 2>&1
test $? -eq 9 -a -f ${SRCFILE} -a ! -f ${DSTFILE} && grep -F "${ERRTEXT}" ${TRUETXT} > /dev/null 2>&1
exit $?
