### Documentation instructions

[Summary of Python recommendations](/docs/documentation/recommendatios.md)

For each file or module developed make sure it requires the following header
```
#--------------------------------------------------------------------------------------------------------------#
# File Name
# Version: x.x.x
# Date: Y-M-d
# Authors: initials
#
# Desc: 
#--------------------------------------------------------------------------------------------------------------#

```

For each class/function or code block add a brief comment explaining what the code itself cannot describe

```py

# This comment 
#       ↓
# The file is recieved via API request from module X 
def preprocessFile($file):
    #logic
    return 'x'
```

Full example

```py

#--------------------------------------------------------------------------------------------------------------#
# preprocessFile.py
# Version: 0.0.1
# Date: 2025-06-01
# Authors: DM
#
# Desc: This module preprocesses the file by running OCR scanning, chunking... etc.
#--------------------------------------------------------------------------------------------------------------#

# The file is recieved via API request from module X
def preprocessFile($file):
    #logic
    return 'x'
```