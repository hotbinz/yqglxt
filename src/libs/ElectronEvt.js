import electron from "electron";
let eletronEvt = {}
eletronEvt.registerListener = function () {
    //关闭窗口
    Hub.$on("window-close", ()=>{
        var ipc = electron.ipcRenderer;
        ipc.send("window-close");    
    });
    //显示主窗口
    Hub.$on("window-main-show", ()=>{
        var ipc = electron.ipcRenderer;
        ipc.send("window-main-show");    
    })
    //窗口最小化
    Hub.$on("window-minimize", ()=>{
        var ipc = electron.ipcRenderer;
        ipc.send("window-minimize");    
    })
}
export default eletronEvt;