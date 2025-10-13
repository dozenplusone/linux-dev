set pagination off

b range_get if pr->_curval % 5 == 0
command 1
    printf "start=%d stop=%d step=%d curval=%d\n", \
            pr->start, pr->stop, pr->step, pr->_curval
    cont
end

run 1 12 > /dev/null
quit
