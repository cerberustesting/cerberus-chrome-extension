# cerberus-chrome-extension

A Cerberus companion extension for Google Chrome browser.
[![Screenshots](https://raw.githubusercontent.com/cerberustesting/cerberus-chrome-extension/main/docs/demo.gif)](https://cerberus-testing.com/)

## What is it ?

Cerberus extension is a companion app for testers using Cerberus Testing platform (see [official website](https://cerberus-testing.com/) and [GitHub repository](https://github.com/cerberustesting/cerberus-source)).
This extension aims to provide various tools for testers to help them complete specific Cerberus use cases.

## Features

- **Erratum use case :** copy to clipboard the full xpath + the source code, formated like `erratum=<full xpath>,<source code>`

## How to use the extension
- Install the plugin on your Google Chrome web browser
- Click on the Cerberus logo to display the extension popin
- Click on the erratum button to activate the extension
- Hover and click on the element you want to get the path of
  - The result is copied into your clipboard
- Click on the button to turn the extension off
  - The extension is active as long as you click on the button to turn it off
    - blue button = inactive
    - orange button = active

### Known issues
- There are still some cases where the extension doesn't properly override the default javascript behaviour of the web page
- If you switch tabs, the extension is still active but the script that the extension needs to work properly has not been injected in the new tab web page. Turn the extension off/on to inject the script in the current tab
- The script injected by the extension is present on the page as long as you don't reload the page, which can cause css issues. Just reload the page to delete the script and get back to the default css

## Where can I get the extension ?

This extension is available on [Chrome Web Store](https://chrome.google.com/webstore/detail/cerberus-extension/cfgifhmddmhbdndfceikcigagacjfepl?hl=en). 

## For developers

- Clone the repository
- Open your Google Chrome browser
- Go to [chrome://extensions](chrome://extensions)
- enable `Developper mode`
- Click on `load unpacked extension`
- Select the project folder
- The extension will now appear with your other plugins (jigsaw icon)
- Pin it to keep it in your toolbar

## Licence

**Cerberus extension Copyright (C) 2013 - 2021 cerberustesting**

This file is part of Cerberus extension.

Cerberus extension is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Cerberus extension is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Cerberus extension. If not, see http://www.gnu.org/licenses/.
