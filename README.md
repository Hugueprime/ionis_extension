*pull request and ideas are welcome*

## What does it do ?
* Design
  * Fixe position of course timeline aside
  * Reduce header height in courses list
* Functionalities
  * Summary at flyover in a course
  * To do date for each module (hard coded)
  * Change the default video player of a course (adapted from [IONISxBetterVideo](https://github.com/Tim-xD/IONISxBetterVideo))

## Make it work

### Add the extension
1. Download this repo
2. Go to `chrome://extensions` and enable "developer mode"
3. Load unpacked extension and select the directory where you downloaded the repo

### Connect to ionisx
In order to the extension to fetch the summary, it need the ionisx token.

You can find them in  [ionisx](https://ionisx.com) > dev tools > application > cookies > https://ionisx.com

If you have the extension from source you can :

Create `./config.js` on the model of `./config.sample.js` and complete missing values with yours. 

If you have the extension from the store you have the graphical interface.