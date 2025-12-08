SUBDIRS = src po
.PHONY: clean docs http man

@DX_RULES@

docs:	doxygen-doc

http:	doxygen-doc
	python3 -m http.server --directory $</html

guesser.1:	src
	$(MAKE) -C $< guesser
	help2man -s1 -LC -N $</guesser > $@

man:	guesser.1

man1_MANS = guesser.1

clean:
	git clean -xdf .
