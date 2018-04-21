const {app, BrowserWindow, ipcMain, shell} = require('electron')
const {autoUpdater} = require("electron-updater")
const path = require('path')
const url = require('url')

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win

function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({width: 400, height: 450, frame: false})
  win.once('ready-to-show', () => {
    win.show()
  })

  // 然后加载应用的 index.html。
  win.loadURL(url.format({
    pathname: path.join(__dirname, './index_prod.html'),
    protocol: 'file:',
    slashes: true
  }))

  // 打开开发者工具。
  //win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })

  win.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    if (frameName === 'modal') {
      // open window as modal
      event.preventDefault()
      Object.assign(options, {
        modal: true,
        parent: win,
        resizable:(options.resizable === 'true')
      })
      event.newGuest = new BrowserWindow(options)
      event.newGuest.loadURL(url) 
    }
    else if(frameName === 'browser') {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
  //updateHandle();
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('window-close', () => {
  if (win != null) {
    win.close();
  }
});

ipcMain.on('window-main-show', ()=>{
  if (win != null) {
    var bounds = win.getBounds();
    bounds.width = 1400;
    bounds.height = 750;
    bounds.x = 100;
    bounds.y = 100;
    win.setBounds(bounds,true);
  }
});

ipcMain.on('window-minimize', () => {
  if (win != null) {
    win.minimize()
  }
})

// 在这文件，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写

let message = {
  error: '检查更新出错',
  checking: '正在检查更新……',
  updateAva: '检测到新版本，正在下载……',
  updateNotAva: '现在使用的就是最新版本，不用更新',
};
//autoUpdater.autoDownload = false;
autoUpdater.setFeedURL("https://raw.githubusercontent.com/hotbinz/update/master/");//https://gitee.com/huobin/update/raw/master/
autoUpdater.on('error', function (error) {
  sendUpdateMessage(message.error)
});
autoUpdater.on('checking-for-update', function () {
  sendUpdateMessage(message.checking)
});
autoUpdater.on('update-available', function (info) {
  sendUpdateMessage(message.updateAva)
  win.webContents.send('ipcReceive', 'isUpdateAvailable', info)
});
autoUpdater.on('update-not-available', function (info) {
  sendUpdateMessage(message.updateNotAva)
  win.webContents.send('ipcReceive', 'isUpdateNoAvailable')
});

// 更新下载进度事件
autoUpdater.on('download-progress', function (progressObj) {
  win.webContents.send('ipcReceive', 'downloadProgress', progressObj)
})
autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
  // ipcMain.on('isUpdateNow', (e, arg) => {
  //   //some code here to handle event
  //   autoUpdater.quitAndInstall();
  // });
  autoUpdater.quitAndInstall();
  win.webContents.send("ipcReceive", 'isUpdateNow')
});

ipcMain.on("checkForUpdate",()=>{
    //执行自动更新检查
    autoUpdater.checkForUpdates();
});

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  win.webContents.send("ipcReceive", 'message', text)
}