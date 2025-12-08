SUBDIRS = src po
.PHONY: clean docs man

@DX_RULES@

docs:	doxygen-doc

guesser.1:	src
	$(MAKE) -C $< guesser
	help2man -s1 -LC -N $</guesser > $@

man:	guesser.1

man1_MANS = guesser.1

clean:
	git clean -xdf .
