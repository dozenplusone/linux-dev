ERRTEXT=$(mktemp)
TRUETXT=$(mktemp)
SRCFILE=$(mktemp)
DSTFILE=${SRCFILE}.new

clean() {
    trap - EXIT
    rm -f ${ERRTEXT} ${TRUETXT} ${SRCFILE}
}

trap clean EXIT HUP INT QUIT PIPE TERM

echo "$(basename $1): cannot stat '${SRCFILE}': No such file or directory" > ${ERRTEXT}
rm -f ${SRCFILE}
$1 ${SRCFILE} ${DSTFILE} > ${TRUETXT} 2>&1
test $? -eq 2 -a ! -f ${SRCFILE} -a ! -f ${DSTFILE} && cmp ${TRUETXT} ${ERRTEXT}
exit $?
