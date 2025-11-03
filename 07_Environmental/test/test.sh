STRINGS=(
    "Test string"
    "The quick brown fox jumps ove1r the lazy dog."
    "a42833d8ed0eeefff5f2a3d3f24037a6a3bd3329"
    "Crescit amor nummi, quantum ipsa pecunia crescit"
    "NT 5.0.  All the bugs and ten times the code size!"
)
FILES=(
    /bin/echo
    /dev/null
    /etc/passwd
)
RHASHER_INPUT=$(mktemp)
TRUE_INPUT=$(mktemp)

clean() {
    trap - EXIT
    rm -f ${RHASHER_INPUT} ${TRUE_INPUT}
}

trap clean EXIT HUP INT QUIT PIPE TERM

for s in "${STRINGS[@]}"
do
    echo "SHA1 \"$s" > ${RHASHER_INPUT}
    echo -n "$s" > ${TRUE_INPUT}
    RESULT=$(./rhasher < ${RHASHER_INPUT})
    RESULT=${RESULT//"SHA1 \"$s"}
    cksum -a sha1 < ${TRUE_INPUT} | grep -F ${RESULT} > /dev/null 2>&1 || exit $?

    echo "sha1 \"$s" > ${RHASHER_INPUT}
    echo -n "$s" > ${TRUE_INPUT}
    RESULT=$(./rhasher < ${RHASHER_INPUT})
    RESULT=${RESULT//"sha1 \"$s"}
    cksum -a sha1 --base64 < ${TRUE_INPUT} | grep -F ${RESULT} > /dev/null 2>&1 || exit $?

    echo "MD5 \"$s" > ${RHASHER_INPUT}
    echo -n "$s" > ${TRUE_INPUT}
    RESULT=$(./rhasher < ${RHASHER_INPUT})
    RESULT=${RESULT//"MD5 \"$s"}
    cksum -a md5 < ${TRUE_INPUT} | grep -F ${RESULT} > /dev/null 2>&1 || exit $?

    echo "md5 \"$s" > ${RHASHER_INPUT}
    echo -n "$s" > ${TRUE_INPUT}
    RESULT=$(./rhasher < ${RHASHER_INPUT})
    RESULT=${RESULT//"md5 \"$s"}
    cksum -a md5 --base64 < ${TRUE_INPUT} | grep -F ${RESULT} > /dev/null 2>&1 || exit $?
done

for f in "${FILES[@]}"
do
    echo "SHA1 $f" > ${RHASHER_INPUT}
    RESULT=$(./rhasher < ${RHASHER_INPUT})
    RESULT=${RESULT//"SHA1 $f"}
    cksum -a sha1 "$f" | grep -F ${RESULT} > /dev/null 2>&1 || exit $?

    echo "sha1 $f" > ${RHASHER_INPUT}
    RESULT=$(./rhasher < ${RHASHER_INPUT})
    RESULT=${RESULT//"sha1 $f"}
    cksum -a sha1 --base64 "$f" | grep -F ${RESULT} > /dev/null 2>&1 || exit $?

    echo "MD5 $f" > ${RHASHER_INPUT}
    RESULT=$(./rhasher < ${RHASHER_INPUT})
    RESULT=${RESULT//"MD5 $f"}
    cksum -a md5 "$f" | grep -F ${RESULT} > /dev/null 2>&1 || exit $?

    echo "md5 $f" > ${RHASHER_INPUT}
    RESULT=$(./rhasher < ${RHASHER_INPUT})
    RESULT=${RESULT//"md5 $f"}
    cksum -a md5 --base64 "$f" | grep -F ${RESULT} > /dev/null 2>&1 || exit $?
done
