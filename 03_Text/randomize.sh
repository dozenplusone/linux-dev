TMPFILE=$(mktemp)
X=0
Y=0

clean() {
    trap - EXIT
    rm -f ${TMPFILE}
}

trap clean EXIT HUP INT PIPE QUIT TERM

for char in $(cat | od -An -v -t x1)
do
    echo $Y $X ${char} >> ${TMPFILE}
    case ${char} in
    0a) Y=$((Y + 1)) ; X=0 ;;
    *) X=$((X + 1)) ;;
    esac
done

shuf ${TMPFILE} -o ${TMPFILE}
tput clear

while read y x char
do
    tput cup $y $x
    /bin/echo -ne "\x${char}"
    sleep ${1:-0}
done < ${TMPFILE}

tput cup $((Y + (X != 0))) 0
