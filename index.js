/**
 * Copyright (C) 2016 pantojs.xyz
 * index.js
 *
 * changelog
 * 2016-06-21[17:47:56]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.0.3
 * @since 0.0.1
 */
'use strict';

process.env.PANTO_LOG_LEVEL = 'info';

const path = require('path');
const fs = require('fs');

const findup = require('findup-sync');
const {warn, error} = require('panto-logger');
const resolve = require('resolve').sync;
const nopt = require("nopt");

const knownOpts = {
    'watch': Boolean,
    'pantofile': String
};
const shortHands = {
    'w': '--watch',
    'f': '--pantofile'
};

const argv = nopt(knownOpts, shortHands, process.argv, 2);
const CWD = argv.pantofile ? path.dirname(argv.pantofile) : process.cwd();

let panto;

let pantoPath;

try {
    pantoPath = resolve('panto', {
        basedir: '.'
    });
} catch (ex) {
    pantoPath = findup('src/panto.js');

    if (!pantoPath) {
        error('Unable to find local panto.');
        process.exit(-1);
    }
}

panto = require(pantoPath);

panto.setOptions({
    cwd: CWD
});

const pantoFile = argv.pantofile || path.join(CWD, 'pantofile.js');

if (fs.existsSync(pantoFile) && fs.statSync(pantoFile).isFile()) {
    let pf = require(pantoFile);
    if (panto.util.isFunction(pf)) {
        pf(panto);
    }
} else {
    warn(`No pantofile.js found`);
}

panto.on('error', err => {
    error(err);
});

// Final build
panto.build().then(() => {
    if (argv.watch) {
        panto.watch();
    }
});