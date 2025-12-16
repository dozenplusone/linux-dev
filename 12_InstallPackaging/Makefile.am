SUBDIRS = include po src tests
.PHONY: clean

@DX_RULES@

all-local:	doxygen-doc

doxygen-doc/man/man3/utcdate.h.3:	doxygen-doc

man3_MANS = doxygen-doc/man/man3/utcdate.h.3

install-data-local:
	mkdir -p $(DESTDIR)/$(docdir)/libutcdate
	cp -a doxygen-doc/html $(DESTDIR)/$(docdir)/libutcdate

uninstall-local:
	rm -r $(DESTDIR)/$(docdir)/libutcdate

clean:
	git clean -xdf .
