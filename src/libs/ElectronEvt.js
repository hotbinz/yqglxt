import electron from "electron";
let eletronEvt = {}
eletronEvt.registerListener = function () {    
    var ipc = electron.ipcRenderer;
    Hub.$on("ipcSend", (command)=>{    
        ipc.send(command);    
    });
    ipc.on("ipcReceive", (evt, command, val) => {     
        Hub.$emit(command, val);
    });    
}
export default eletronEvt;