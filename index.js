/**
 * Copyright (C) 2016 pantojs.xyz
 * index.js
 *
 * changelog
 * 2016-06-21[17:47:56]:revised
 * 2016-07-20[23:52:10]:support loglevel
 *
 * @author yanni4night@gmail.com
 * @version 0.0.4
 * @since 0.0.1
 */
'use strict';

const path = require('path');
const fs = require('fs');

const findup = require('findup-sync');

const resolve = require('resolve').sync;
const nopt = require("nopt");

const knownOpts = {
    'watch': Boolean,
    'pantofile': String,
    'loglevel': String
};
const shortHands = {
    'w': '--watch',
    'f': '--pantofile',
    'l': '--loglevel'
};

const argv = nopt(knownOpts, shortHands, process.argv, 2);
const CWD = argv.pantofile ? path.dirname(argv.pantofile) : process.cwd();


if (argv.loglevel) {
    process.env.PANTO_LOG_LEVEL = argv.loglevel;
    const logger = require('panto-logger');
    const {warn, error} = logger;
    logger.setLevel(argv.loglevel);
}

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