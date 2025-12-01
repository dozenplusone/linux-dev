SUBDIRS = src tests
.PHONY: gcov clean

gcov:	check
	$(MAKE) $(MAKEFLAGS) -C src gcov

clean:
	git clean -xdf .
