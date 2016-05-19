# master

### unreleased

### [v0.4.3] - 2016-05-19
- **fix:** rename Wurst.factory into Wurst.init
- **rmv:** unneeded console statements
- **fix:** rename factory into plugin
- **doc:** update CHANGELOG.md

### [v0.4.2] - 2016-05-19
- **add:** function to check if arguments passed to oolo are objects
- **doc:** update CHANGELOG.md

### [v0.4.1] - 2016-05-19
- **add:** documentation of entry factory file
- **fix:** npm scripts
- **add:** OLOO function to combine objects by linking
- **doc:** update CHANGELOG.md

### [v0.4.0] - 2016-05-19
- **fix:** convert class into OLOO syntax and extract factory
- **fix:** move babel-polyfill integration to entry point
- **fix:** simplify plugin loading
- **doc:** update CHANGELOG.md

### [v0.3.2] - 2016-05-18
- **fix:** refactor routeMap -> routeList
- **fix:** extract #extendRouteList
- **doc:** fix typo
- **upg:** babel-cli, babel-core and babel-preset-2015 (6.8.0 -> 6.9.0) and eslint (2.10.1 -> 2.10.2)
- **add:** documentation of parameter
- **doc:** update CHANGELOG.md

### [v0.3.1] - 2016-05-17
- **doc:** add explanation for options.log
- **fix:** remove trailing slashes
- **doc:** add hint about the deletion of trailing slashes
- **doc:** update CHANGELOG.md

### [v0.3.0] - 2016-05-16
- **fix:** refactor
- **fix:** extract class into new file
- **fix:** convert Wurst#schemata into Wurst.schemata
- **fix:** enable multiple registration
- **doc:** add hint about multiple registration
- **add:** test specification for non-existing path
- **add:** joi based validation for route config objects
- **add:** sinon (1.17.4) and sinon-chai (2.8.0)
- **rmv:** do not lint test directory
- **add:** functionality to log the route mapping
- **add:** custom eslint rule (no-unsed-expressions)
- **fix:** extract Wurst#load
- **doc:** update CHANGELOG.md

### [v0.2.1] - 2016-05-16
- **doc:** fix typo
- **fix:** refactor
- **fix:** remove unnecessary joi.optional() calls
- **add:** documentation blocks for helper functions
- **upg:** eslint (2.9.0 -> 2.10.1)
- **fix:** lint
- **fix:** rename internals.schema into internals.schemata
- **fix:** replace specific errors with general ones
- **fix:** changed specification
- **fix:** double prefixed routes when registered multiple times
- **doc:** update CHANGELOG.md

### [v0.2.0] - 2016-05-15
- **fix:** change eslint (no-param-reassign) rule
- **add:** hapi (13.x.x) as peer dependency
- **add:** joi (8.1.0) as dependency
- **add:** joi based validation for plugin options
- **doc:** update CHANGELOG.md

### [v0.1.2] - 2016-05-15
- **doc:** fix typo
- **add:** logo file
- **doc:** link logo in README.md
- **doc:** fix typo
- **fix:** lint
- **doc:** refactor README.md
- **rmv:** remove sinon and sinon-chai
- **doc:** update CHANGELOG.md

### [v0.1.1] - 2016-05-14
- **doc:** fix typo
- **fix:** refactor
- **doc:** update CHANGELOG.md

### [v0.1.0] - 2016-05-14
- **add:** initial files
- **doc:** usage chapter
- **doc:** example chapter
- **doc:** fix the example chapter
- **doc:** fix typo
- **add:** glob (7.0.3)
- **fix:** add ignore pattern functionality and make use of glob
- **fix:** adjust specification concerning added functionality
- **doc:** adjust usage chapter concerning added functionality
- **fix:** disable multiple registration
- **fix:** rename options.dir into options.routes
- **doc:** update CHANGELOG.md