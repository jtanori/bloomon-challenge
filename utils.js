/**
 * @function parseRule
 * @description converts rule string into a bouquet object
 * @returns {object} describes a bouquet object
 * @param {string} rule
 */
const constants = require('./constants')
const exceptions = require('./exceptions')

function parseRule (rule) {
    const {
        INVALID_RULE_LENGTH,
        INVALID_RULE,
        INVALID_PARSED_RULE,
        INVALID_FLOWER_SUMATORY,
        INVALID_FLOWER_ARGUMENTS,
        DUPLICATED_FLOWER_DEFINITION,
        RuleException,
        StreamException
    } = exceptions
    const { 
        BOUQUET_REGEX,
        FLOWER_REGEX
    } = constants

    if (!rule || typeof rule !== 'string') {
        throw new RuleException(INVALID_RULE)
    }

    if (rule.length < 6) {
        throw new RuleException(INVALID_RULE_LENGTH)
    }

    try {
        if (BOUQUET_REGEX.test(rule)) {
            const parsedRule = BOUQUET_REGEX.exec(rule)
            
            if (!parsedRule || parsedRule.length < 5) {
                throw new RuleException(INVALID_RULE)
            }

            const type = parsedRule[1]
            const size = parsedRule[2] === 'S' ? 'small' : 'large'
            const total = parseInt(parsedRule[parsedRule.length - 1], 10)
            const parsedList = parsedRule[3]
                .split(FLOWER_REGEX)
                .filter(r => r.length)
            const typesFound = {}
            // Flower species are identified by a single, small letter: a - z .
            // The flowers are listed in alphabetic order, and they are listed only once in a bouquet.
            const list = parsedList
                .filter(r => {
                    const type = r.substr(r.length-1)
                    const validType = type.toLowerCase()
                    // We'll save found types for later
                    if (typesFound[validType]) {
                        throw new RuleException(
                            Object.assign({}, DUPLICATED_FLOWER_DEFINITION, {
                                data: type
                            })
                        )
                    } else {
                        typesFound[validType] = true
                    }

                    return type.toLowerCase() === type
                })
            // All flower quantity values have to be bigger than 0.
                .map((r) => {
                    const flowerTotal = parseInt(r.substr(0, r.length - 1), 10)
                    const flowerType = r.substr(r.length-1)

                    if (flowerTotal > 0) {
                        return {
                            total: flowerTotal,
                            type: flowerType
                        }
                    }
                })
            
            if (parsedList.length > list.length) {
                throw new RuleException(Object.assign({}, INVALID_FLOWER_ARGUMENTS, {
                    data: { list, parsedList }
                }))
            }
            /*
            The total quantity can be bigger than the the sum of the flower quantities, 
            allowing extra space in the bouquets that can consist of any kind of flowers.
            */
            const totalRequestFlowers = list.reduce((c, n) => {
                return c + n.total
            }, 0)
            
            if (totalRequestFlowers > total) {
                throw new RuleException(INVALID_FLOWER_SUMATORY)
            }
            
            if (list.length) {
                return {
                    size,
                    sizeCode: parsedRule[2], 
                    type,
                    total,
                    padding: total - totalRequestFlowers,
                    initialDesign: parsedRule[0],
                    input: parsedRule[3],
                    list
                }
            }

            throw new RuleException(INVALID_PARSED_RULE)
        }

        throw new RuleException(INVALID_RULE)
    } catch (e) {
        return e
    }
}

/**
 * @function parseInputStream
 * @description Takes an input stream string and turns it into bouquet and flowers list
 * @returns {object} describes a stream object
 * @param {string} contents
 */
function parseInputStream (contents) {
    const {
        INVALID_STREAM,
        EMPTY_BOUTQUET_STREAM,
        EMPTY_FLOWER_LIST,
        INVALID_FLOWER_STREAM,
        StreamException,
        RuleException
    } = exceptions

    if (typeof contents !== 'string') {
        throw new StreamException(INVALID_STREAM)
    }

    try {
        const segments = contents.split(/\n\n/)

        if (segments.length !== 2) {
            throw new StreamException(INVALID_STREAM)
        }

        const bouquetList = segments[0].split(/\n/g)
        const flowerList = segments[1].split(/\n/g)
        
        if (!bouquetList.length) {
            throw new StreamException(EMPTY_BOUTQUET_STREAM)
        }

        if (!flowerList.length) {
            throw new StreamException(EMPTY_FLOWER_LIST)
        }

        // I could have created a inventory object but I ran out of time
        const inventory = {small: {}, large: {}}
        // Parse all flowers
        flowerList.forEach((flower, i) => {
            let size
            let species
            let invalid = true

            if (flower.length === 2) {
                species = flower.charAt(0)
                size = flower.charAt(1)
            }

            if ((size === 'S' || size === 'L') && species.toLowerCase() === species) {
                invalid = false
            }

            if (invalid) {
                throw new StreamException(Object.assign({}, INVALID_FLOWER_STREAM, {
                    data: { flower, index: i }
                }))
            }

            switch (size) {
                case 'S':
                    if (inventory.small[species]) {
                        inventory.small[species] = inventory.small[species] + 1
                    } else {
                        inventory.small[species] = 1
                    }
                    break;
                case 'L':
                    if (inventory.large[species]) {
                        inventory.large[species] = inventory.large[species] + 1
                    } else {
                        inventory.large[species] = 1
                    }
                    break;
            }
        })
        
        const invalidBouquets = []
        const bouquets = []

        bouquetList.forEach((b) => {
            try {
                bouquet = parseRule(b)

                if (bouquet instanceof RuleException) {
                    throw bouquet
                }

                bouquets.push(bouquet)
            } catch (e) {
                invalidBouquets.push({ design: b, error: e})
            }
        })
        
        return {
            orders: fillBouquets(bouquets, inventory),
            errors: invalidBouquets,
            inventory: inventory
        }
    } catch (e) {
        return e
    }
}

/**
 * @function fillBouquets
 * @description Takes a bouquet list and flowers inventory and creates bouquet output
 * @returns {object} object containing orders fullfiled and failed
 * @param {Array} bouquets
 * @param {Array} inventory
 */
function fillBouquets (bouquets = [], inventory = {}) {
    const {
        INVENTORY_NOT_ENOUGH,
        StreamException
    } = constants

    const bouquetOutput = bouquets.map((b, i) => {
        const from = inventory[b.size]
        const canFullfil = b.list.reduce((c, item) => {
            return from[item.type] && from[item.type] > item.total ? 1 : 0
        }, 0)

        if (canFullfil) {
            const flowerList = []

            // Update flower quantity if there is any padding
            if (b.padding) {
                const padding = b.padding
                const limit = b.list.length
                let whichFlower = 0
                
                for (let i = 0; i < b.padding; i++) {
                    if (whichFlower >= limit) {
                        whichFlower = 0
                    }
                    
                    b.list[whichFlower].total = b.list[whichFlower].total + 1
                    whichFlower = whichFlower + 1
                }
            }

            b.list.forEach((item) => {
                from[item.type] = from[item.type] - item.total
                flowerList.push(`${item.total}${item.type}`)
            })
            
            const design = flowerList.join('')

            return Object.assign(b, {
                output: design,
                design: `${b.type}${b.sizeCode}${design}`
            })
        } else {
            return b.error = new StreamException(Object.assign({}, INVENTORY_NOT_ENOUGH, {
                data: { bouquet: b, index: i }
            })) 
        }
    })

    return bouquetOutput
}

module.exports = {
    parseRule,
    parseInputStream
}