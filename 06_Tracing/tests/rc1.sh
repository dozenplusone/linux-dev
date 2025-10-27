ERRTEXT=$(mktemp)
TRUETXT=$(mktemp)

clean() {
    trap - EXIT
    rm -f ${ERRTEXT} ${TRUETXT}
}

trap clean EXIT HUP INT QUIT PIPE TERM

echo "$(basename $1): usage: $1 infile outfile" > ${ERRTEXT}
$1 > ${TRUETXT} 2>&1
test $? -eq 1 && cmp ${ERRTEXT} ${TRUETXT}
exit $?
