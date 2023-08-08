# PacmanClone
This is a Pacman Clone using only Javascript and HTML5 for practice.

This project was made by following this tutorial https://www.youtube.com/watch?v=5IMXpp3rohQ and has several changes in comparison to the tutorial.

1. Classes and functions have their own .js files, which helps with readability. In order to use the classes and functions in other files, importing and exporting are necessary. Though because of this, the script tag in the index.html file needs to have type="module" so the html recognizes the index.js file.

2. In an effort to avoid too much repetition in the code, i.e. repeated blocks of code, custom functions that you would not see in the video tutorial are created. This is to improve readability within the code. The rest of the code is mostly the same.

3. Some names of the variables are different. This is for personal preference.

4. Movement of the player, unlike in the tutorial, does not stop when the player is not touching the keyboard. The player will continue in the same direction it was going in until they hit a wall.
