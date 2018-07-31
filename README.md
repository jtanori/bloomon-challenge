# Bloomon Code Challenge

### To run on a Linux/MacOS environment
* Clone this repository
* Make sure node is installed
* Open a terminal window and navigate to the cloned repository
* Run `npm install` in your terminal window
* Next run `npm run test` to run the tool using a valid input stream file
* Run `npm run test-invalid` to run the tool usin an invalid input stream file
* To run your own input stream files run `npm run factory -- --file=<path to file>

### To run using Docker
* Build the Docker image
* Run it with the following command `docker run -it <jtanori/bloomon-challenge>`

You should see an output like the following

````terminal
ORDER OUTPUT


AL10a15b5c30 -> AL10a15b5c


AS10a10b25 -> AS13a12b
Order required extra flowers: 5


BL15b1c21 -> BL18b3c
Order required extra flowers: 5


BS10b5c16 -> BS11b5c
Order required extra flowers: 1


DL20b28 -> DL28b
Order required extra flowers: 8


ORDER ERRORS


DESIGN: CL20a15c33
ERROR MESSAGE: Rule total flowers is larger than bouquet max flower allocation
ERROR CODE: rules/invalid-flower-sumatory
ERROR NAME: RuleException
````