# VS Shortcuts

- CMD + C / V / X: Performs the operation, even if the items isn't selected. It'll perform it on the line

## Opening files

- Control shift e: goes to the file explorer [custom]

| Shortcut      | action                            | usefulness                  |
| ------------- | --------------------------------- | --------------------------- |
| cmd down      | open file                         | standard 'mac' open command |
| spacebar      | opens file (preview)              | italicized title            |
| control enter | opens to the side / another group |                             |

## Navigation & file management

| Shortcut                            | action                                     | usefulness                                                          |
| ----------------------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| cmd p                               | Quick open                                 | type and open a filename                                            |
| cmd shift p                         | Command pallete                            | every vscode feature                                                |
| cmd b                               | Toggle sidebar                             |                                                                     |
| cmd alt b                           | toggle right sidebar                       | useful for claude code, for example                                 |
| cmd g                               | go to repo                                 |                                                                     |
| control g                           | Go to line                                 | type the line and jump directly to that line                        |
| cmd option left/right [important]   | move between files / and between terminals |                                                                     |
| control shift e [custom]            | open file explorer                         |                                                                     |
| control shift f [custom]            | open search                                |                                                                     |
| control shift g [important]         | open source control                        |                                                                     |
| cmd \                               | split view                                 |                                                                     |
| cmd control left/right              | moves current tab to another view          | similar to cmd \, but more practical                                |
| cmd shift O (o, letter) [important] | go to symbol                               | type a function/variable name to jump to it inside the current file |
| cmd t [important]                   | go to symbol in project                    | jump to any function or class name anywhere in the entire project   |
| control tab                         | opens the tab manager within that group    |                                                                     |
| control shift tab                   | same as above, but in reverse order        |                                                                     |

## Editing & selection

| Shortcut                                  | action                                  | usefulness                                           |
| ----------------------------------------- | --------------------------------------- | ---------------------------------------------------- |
| cmd /                                     | toggle line comment                     |                                                      |
| option up/down [important]                | move line up/down                       | drag a line without copying or pasting               |
| shift option up/down [important]          | copy line up/down                       | instantly duplicate current line                     |
| cmd shift k                               | delete line                             | removes line without highlighting it                 |
| cmd d                                     | add selection to next match             | select the next occurence of word for bulk editing   |
| cmd option up/down [important]            | insert cursor                           | add cursors above/below for multi-line typing        |
| option shift a [important]                | add a comment block                     | for multi-line comments                              |
| shift alt a [important]                   | commenting out just selected portion    |                                                      |
| cmd shift l                               | select all occurrences                  |                                                      |
| control shift left/right [important]      | block select                            | great to increase/decrease scope                     |
| control shift cmd left/ right [important] | smart select                            | expands or shrinks selection based on code structure |
| shift left/right                          | selecting the text                      |                                                      |
| option left/right [important]             | moves to the end or beginning of a word |                                                      |
| option shift left/right [important]       | moves, while selecting multiple words   |
| alt click                                 | adding multiple cursors                 |                                                      |
| cmd u                                     | undo button for your cursor             |                                                      |
| cmd option up/down                        | adds multiple cursors above/below       |                                                      |

## Structure & indentation

| Shortcut                     | action               | usefulness                    |
| ---------------------------- | -------------------- | ----------------------------- |
| cmd [ / ]                    | indentation          |                               |
| cmd option [ / ] [important] | toggle current block | expands/shrinks current block |

## Code intelligence & refactoring

| Shortcut         | action                          | usefulness                                                            |
| ---------------- | ------------------------------- | --------------------------------------------------------------------- |
| f2               | rename symbol [important]       | rename a variable project-wide, safely. It renames everywhere!        |
| f12              | go to definition                | jump to where a function or variable was first created                |
| shift f12        | go to references [important]    | shows every place in the project that calls/uses that symbol          |
| shift option f12 | find all references [important] | shows on the sidebar everywhere that code is used                     |
| option f12       | peek definition [important]     | see the code of a function in a small pop-up window + where it's used |
| shift option f   | format doc                      | auto-fix all indentation and messy spacing                            |
| cmd .            | quick fix                       |                                                                       |

## UI and integrated terminal

| Shortcut                    | action                  | usefulness                                          |
| --------------------------- | ----------------------- | --------------------------------------------------- |
| control ` (backtick)        | toggle terminal         | show/hide built-in cli                              |
| control shift ` [important] | creates new terminal    |
| cmd j                       | toggle bottom panel     |                                                     |
| cmd 0 (zero) [important]    | focus sidebar           | move keyboard focus to the file explorer            |
| cmd 1/2/3 [important]       | switch editor group     | jump/select between the split screens               |
| control 1/2/3 [important]   | switch tab within group | if group has different tabs, navigates between them |

## Useful `cmd k` chords

| Shortcut                                  | action              | usefulness                                  |
| ----------------------------------------- | ------------------- | ------------------------------------------- |
| cmd k, cmd s                              | keyboard shortcuts  | search, edit, or create shortcuts           |
| cmd k, v                                  | markdown preview    |                                             |
| cmd k, z                                  | zen mode            | distraction-free, full-screen coding view   |
| cmd k, w                                  | close all tabs      |                                             |
| cmd k, control cmd left/right [important] | move editor group   | moves entire window/split to the left/right |
| cmd k, cmd o                              | fold all            |                                             |
| cmd k, cmd j                              | unfold all          |                                             |
| cmd k, cmd c                              | comments all line   |                                             |
| cmd k, cmd u                              | remove line comment |                                             |
| cmd k, enter                              | keep tab open       |                                             |
| cmd k, shift enter                        | pin tab             |                                             |
| cmd k, e [important]                      | open editor view    | shows the groups                            |

## Editor management

| Shortcut     | action               | usefulness                                   |
| ------------ | -------------------- | -------------------------------------------- |
| cmd option t | close others         | closes every tab, except current             |
| cmd shift t  | reopen closed editor | the undo for closed tabs. It reopens them    |
| cmd w        | closes current tab   |                                              |
| control -    | go back              | takes your cursor to where it was previously |

## Search and replace

| Shortcut     | action                           | usefulness                           |
| ------------ | -------------------------------- | ------------------------------------ |
| cmd f        | find current file                |                                      |
| cmd option f | replace text within current file |                                      |
| cmd shift f  | global search                    | searches texts across entire project |
| cmd shift h  | global replace                   | replaces texts across entire project |

## Debugging
