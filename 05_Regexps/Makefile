CFLAGS = -Wall -Wextra
.PHONY: all clean test

all:	esub test

esub:	esub.c

define testcase
	( echo '$3' | sed -E 's/$1/$2/' > true.txt 2> /dev/null ) \
			&& ( ./esub '$1' '$2' '$3' 2> /dev/null | cmp - true.txt ) \
			|| ! ./esub '$1' '$2' '$3' > /dev/null 2>&1
endef

test:
	$(call testcase,(abc).+b(c|e)*,\1\\1\\2\2,abcabc)
	$(call testcase,([2-4]+).*([7-9]+),#\2#\1#,1234567890)
	$(call testcase,(full)(match),\2\1ness,fullmatch)
	$(call testcase,y(z)a(b)c(i)j,\\\2\1\3\\,xyz[abc/&\/|ijk)
	$(call testcase,(regex),\2,iloveregexps)
	$(call testcase,[broken\,,broken])
	$(call testcase, (regular) (express)ion(s?),\
			to \2 emotion\3 \1ly,Learn regular expressions!)
# Assuming no match disregards substitution pattern and sanity checks thereof
# This behavior is different from sed
	test $$(./esub 'regex' 'valid pattern' 'nomatch') == "nomatch"
	test $$(./esub 'regex' 'invalid_\1_pattern' 'nomatch') == "nomatch"

clean:
	rm -f esub true.txt
