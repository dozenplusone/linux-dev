TMPFILE=$(mktemp)
X=0
Y=0

clean() {
    trap - EXIT
    rm -f ${TMPFILE}
}

trap clean EXIT HUP INT PIPE QUIT TERM

for char in $(cat | iconv -t UCS2 | od -An -v -t x2)
do
    case ${char} in
    0020) X=$((X + 1)) ;;
    000a) Y=$((Y + 1)) ; X=0 ; echo $Y $X 000a >> ${TMPFILE} ;;
    *) X=$((X + 1)) ; echo $Y $X ${char} >> ${TMPFILE} ;;
    esac
done

shuf ${TMPFILE} -o ${TMPFILE}
tput clear

while read y x char
do
    tput cup $y $x
    /bin/printf "\u${char}"
    sleep ${1:-0}
done < ${TMPFILE}

tput cup $((Y + (X != 0))) 0
