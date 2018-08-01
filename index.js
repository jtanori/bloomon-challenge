#!/usr/bin/env node
'use strict'
const fs = require('fs')
const meow = require('meow')
const chalk = require('chalk')
const utils = require('./utils')
const cli = meow(`
	${chalk.green('Usage')}
	  $ npm run factory -- <options>

	${chalk.green('Options')}
	  --input, -i  Input file

	${chalk.green('Examples')}
	  $ npm run factory -i ./some-file
`, {
	booleanDefault: undefined,
	flags: {
		input: {
			type: 'string',
			default: '',
			alias: 'i'
		},
		write:{
			type: 'boolean',
			default: true,
			alias: 'w'
		}
	}
})

// Checks for file
if (cli.flags.file) {
	// Does file exists?
	const fileExists = fs.existsSync(cli.flags.file)
	
	if (fileExists) {
		// Read file contents
		const fileContents = fs.readFileSync(cli.flags.file, 'utf8')
		// Parse file contents
		const segments = utils.parseInputStream(fileContents.toString())
		
		if (segments.orders) {
			console.log(chalk.bgGreen('ORDER OUTPUT'))
			console.log('\n')
			segments.orders.forEach((o) => {
				console.log(`${chalk.yellow(o.initialDesign)} ${chalk.blue('->')} ${chalk.yellow(o.design)}`)
				if (o.padding) {
					console.log(`${chalk.gray('Order required extra flowers:')}`, `${chalk.gray(o.padding)}`)
					console.log('\n')
				} else {
					console.log('\n')
				}
			})
		} else {
			console.log(chalk.bgRed('NO VALID ORDERS TO SHOW'))
		}
		// Show errors
		if (segments.orders) {
			console.log(chalk.bgRed('ORDER ERRORS'))
			console.log('\n')
			segments.errors.forEach((order) => {
				console.log(chalk.bold(chalk.red('DESIGN:')), chalk.red(order.design))
				console.log(chalk.bold(chalk.red('ERROR MESSAGE:')), chalk.red(order.error.message))
				console.log(chalk.bold(chalk.red('ERROR CODE:')), chalk.red(order.error.code))
				console.log(chalk.bold(chalk.red('ERROR NAME:')), chalk.red(order.error.name))
				if (order.error.data) {
					console.log(chalk.bold(chalk.red('ERROR DATA:')), chalk.red(order.error.data))
				}
			})
		}
	} else {
		throw new Error(chalk.red(`FILE ${cli.flags.file} does not exists or can't be read`))
	}
} else {
	cli.showHelp()
}