/* BOUQUET RULE */
/* ------------------------------------- */

const INVALID_RULE = {
    message: 'Bouquet is not valid',
    code: 'rules/invalid-bouquet'
}
const INVALID_RULE_LENGTH = { 
    message: 'Rule must be at least 6 characters length',
    code: 'rules/invalid-rule-length'
}
const INVALID_PARSED_RULE = { 
    message: 'Rule does not seems to be standard',
    code: 'rules/invalid-rule-output'
}

const INVALID_FLOWER_SUMATORY = {
    message: 'Rule total flowers is larger than bouquet max flower allocation',
    code: 'rules/invalid-flower-sumatory'
}

const INVALID_FLOWER_ARGUMENTS = {
    message: 'Passed flower list is invalid',
    code: 'rules/invalid-flower-list'
}

const DUPLICATED_FLOWER_DEFINITION = {
    message: 'Passed flower list contain duplicates',
    code: 'rules/invalid-flower-list-duplicated'
}

function RuleException(e) {
    this.message = e.message
    this.code = e.code
    this.data = e.data
    this.name = 'RuleException'
 }

/* ------------------------------------- */

/* INPUT STREAM */
/* ------------------------------------- */

const INVALID_STREAM = {
    message: 'Data is not valid',
    code: 'stream/invalid-data'
}

const EMPTY_BOUTQUET_STREAM = {
    message: 'No bouquets found in stream',
    code: 'stream/no-bouquets'
}

const EMPTY_FLOWER_LIST = {
    message: 'No flowers found in stream',
    code: 'stream/no-flowers'
}

const INVALID_FLOWER_STREAM = {
    message: 'Invalid flowers in stream',
    code: 'stream/invalid-flower'
}

const INVENTORY_NOT_ENOUGH = {
    message: 'Can not fullfil order, not enough inventory',
    code: 'stream/inventory-not-enough'
}

function StreamException(e) {
    this.message = e.message
    this.code = e.code
    this.data = e.data
    this.name = 'StreamException'
}

module.exports = {
    INVALID_RULE,
    INVALID_RULE_LENGTH,
    INVALID_PARSED_RULE,
    INVALID_FLOWER_SUMATORY,
    INVALID_FLOWER_ARGUMENTS,
    DUPLICATED_FLOWER_DEFINITION,
    RuleException,
    INVALID_STREAM,
    EMPTY_BOUTQUET_STREAM,
    EMPTY_FLOWER_LIST,
    INVALID_FLOWER_STREAM,
    INVENTORY_NOT_ENOUGH,
    StreamException
}