ERRTEXT=$(mktemp)
TRUETXT=$(mktemp)
SRCFILE=$(mktemp)

clean() {
    trap - EXIT
    rm -f ${ERRTEXT}  ${TRUETXT} ${SRCFILE}
}

trap clean EXIT HUP INT QUIT PIPE TERM

echo "$(basename $1): '${SRCFILE}' and '${SRCFILE}' are the same file" > ${ERRTEXT}
$1 ${SRCFILE} ${SRCFILE} > ${TRUETXT} 2>&1
test $? -eq 3 -a -f ${SRCFILE} && cmp ${TRUETXT} ${ERRTEXT}
exit $?
