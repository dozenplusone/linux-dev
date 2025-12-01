SUBDIRS = src tests
.PHONY: checklog gcov clean

checklog:	check
	cat tests/test-suite.log $$(find tests -name '*.log' -not -name 'test-suite.log')

gcov:	check
	$(MAKE) $(MAKEFLAGS) -C src gcov

clean:
	git clean -xdf .
