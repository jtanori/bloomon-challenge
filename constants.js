/*
A rule, a design spec is a single line of characters in the following format:

<bouquet design><bouquet size><flower 1 quantity><flower 1
specie><f.2 quantity><f.2 specie>...<f.N quantity><f.N
specie><total quantity of flowers in bouquet>

*/
const BOUQUET_REGEX = /([A-Z])(L|S)((\d+[A-z])+)(\d+)/
const FLOWER_REGEX = /(\d+[A-z])/

module.exports = {
    BOUQUET_REGEX,
    FLOWER_REGEX
}