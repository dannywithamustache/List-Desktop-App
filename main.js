const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, Menu, BrowserWindow, ipcMain } = electron;

let mainWindow;
let addWindow;

//Set env for production or relaese
process.env.NODE_ENV = 'dev';

//Check if app is ready
app.on('ready', function(){

    //Create a new window
mainWindow = new BrowserWindow;

    //Load html into window
mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file',
    slashes: true
}));
//Quit app when closed
mainWindow.on('closed', function(){
    app.quit();
});

// Create menu from template
const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
// Set menu in app
Menu.setApplicationMenu(mainMenu);

});

// Add Item
function createAddWindow(){
    //Create new window to add items
    addWindow = new BrowserWindow({
        width: 300,
        height: 136,
        title: 'Add List Items'
    });
    //Apply html to window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    //Garbage collection
    addWindow.on('close', function(){
        addWindow = null;
    });
};
//ipc to send info to different pages, ie. add and remove items
ipcMain.on('item:add', function(e, item){
    console.log(item);
    // takes the input and 'send' it to html of mainWindow
    mainWindow.webContents.send('item:add', item);
    //close addWindow once submited
    addWindow.close();
});

//make menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label: 'Add Item',
                accelerator: 'Shift+A',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    //remove all items
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Cmd+Q' : 
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
            
        ]

        
    }

];
// fix menu if on mac
if(process.platform == 'darwin'){
    //blank object to prevent the odd spacing of menu on mac
    mainMenuTemplate.unshift({});
}

// Add dev tool
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
        label: 'Dev Tools',
        accelerator: process.platform == 'darwin' ? 'Cmd+I' : 
        'Ctrl+I',
        click(item, focusedWindow){
            focusedWindow.toggleDevTools();
                }
            },
        {
        role: 'reload'
        }
        ]
    });
} 

