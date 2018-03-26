import electron from "electron";
let eletronEvt = {}
eletronEvt.registerListener = function () {
    console.info("electron");
    //关闭窗口
    Hub.$on("window-close", ()=>{
        var ipc = electron.ipcRenderer;
        ipc.send("window-close");    
    })
}
export default eletronEvt;