REFTEXT=$(mktemp)
SRCFILE=$(mktemp)
DSTFILE=$(mktemp)

clean() {
    trap - EXIT
    rm -f ${REFTEXT} ${SRCFILE} ${DSTFILE}
}

trap clean EXIT HUP INT QUIT PIPE TERM

echo "1234567890" > ${REFTEXT}
cat ${REFTEXT} > ${SRCFILE}
$1 ${SRCFILE} ${DSTFILE}
test $? -eq 0 -a ! -f ${SRCFILE} -a -f ${DSTFILE} && cmp ${REFTEXT} ${DSTFILE}
exit $?
