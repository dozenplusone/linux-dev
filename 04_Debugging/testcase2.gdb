set pagination off
set $COUNT = 0

b range_get if 28 <= ++$COUNT && $COUNT <= 35
command 1
    printf "start=%d stop=%d step=%d curval=%d\n", \
            pr->start, pr->stop, pr->step, pr->_curval
    cont
end

run -100 100 3 > /dev/null
quit
