<style scoped>
.layout{
    position: relative;
    overflow: hidden;
    height:100%;
}
.ivu-layout{height:100%;}
.ivu-layout-header,.ivu-menu-horizontal{
    height: auto;
    line-height: 12px;
    padding:0px;
    background-color:dimgray;
}
.layout-logo{
    width: 180px;
    height: 16px;
    color:white;
    float: left;
    position: relative;
    top: 10px;
    left: 10px;
}
.layout-button{
    width: 81px;
    margin: 0 auto;
    margin-right: 0px;   
}
.noSelectText {
    -webkit-user-select: none;
}
 .demo-spin-container{
    	display: inline-block;
        width: 100%;
        height: 100%;
        position: relative;
    }
</style>
<template>
  <div class="layout">
      <Layout>
            <Header class="noSelectText" style="-webkit-app-region: drag;">
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo">用户登录</div>
                    <div class="layout-button">
                        <ButtonGroup>
                            <Button type="text" style="color:#FFF;-webkit-app-region: no-drag;" @click="windowMinimize">
                                <Icon type="minus-round"></Icon>
                            </Button>
                            <Button type="primary" style="color:#FFF;-webkit-app-region: no-drag; border-radius: 0" @click="windowClose">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </ButtonGroup>
                    </div>
                </Menu>
            </Header>
            <Content>
                <Form ref="loginForm" :model="formData" :rules="ruleValidate" style="padding:30px;">
                    <FormItem label="用户名：" prop="username">
                        <Input type="text" v-model="formData.username" placeholder="Username">
                            <Icon type="ios-person-outline" slot="append"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem label="密码：" prop="password">
                        <Input type="password" v-model="formData.password" placeholder="Password">
                            <Icon type="ios-locked-outline" slot="append"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Checkbox v-model="formData.remember">记住密码</Checkbox>
                    </FormItem>                    
                    <FormItem style="text-align:right;margin-top:45px;">
                        <Button type="success" @click="handleLogin('loginForm')" long :loading='isloging'>登录</Button>
                    </FormItem>

                    <Alert type="error" show-icon v-show="iserror">{{errorMsg}}</Alert>
                </Form>
            </Content>
             <div class="demo-spin-container">
                <Spin v-if="autoUpdate.checkUpdate">                    
                </Spin>
            </div>
      </Layout>
     
      <Modal
        v-model="autoUpdate.isUpdate"
        title="程序有更新"
        :loading="isDownload"
        :closable="false"
         :mask-closable="false"
         :ok-text='autoUpdate.okText'
         @on-cancel="cancel"
        @on-ok="asyncOK">
        <p>{{autoUpdate.tips}}</p>
        <p>{{autoUpdate.info}}</p>
        <Progress :percent="autoUpdate.downloadPercent"></Progress>
    </Modal>
  </div>  
</template>

<script>
    //import { ipcRenderer } from "electron";
    export default {
        data() {
            return {
                isloging:false,
                iserror:false,
                errorMsg:'',
                isDownload:true,
                autoUpdate:{
                    tips:'',
                    info:'',
                    okText:'是',
                    downloadPercent:0,
                    checkUpdate: true,
                    isUpdate:false                    
                },
                formData: {
                    'username':this.$store.state.user.username,
                    'password':this.$store.state.user.password,
                    'remember':true
                },
                ruleValidate: {
                    username: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ]
                },
            }
        },
        mounted() {
            //检查更新
            Hub.$emit('ipcSend','checkForUpdate');
            Hub.$on("message", (text)=>{
                this.autoUpdate.tips = text;
            });
             Hub.$on("downloadProgress", (progressObj)=>{
                  this.autoUpdate.okText = "下载中.";
                 this.autoUpdate.downloadPercent = parseInt(progressObj.percent) || 0;    
                 if(this.autoUpdate.downloadPercent >= 100) {
                      Hub.$emit('ipcSend','isUpdateNow');
                 }       
            });
            Hub.$on("isUpdateNoAvailable", ()=>{
                this.autoUpdate.checkUpdate = false;
            });
            Hub.$on("isUpdateAvailable", (info)=>{
                 this.autoUpdate.info = info.releaseNotes
                 this.autoUpdate.checkUpdate = false;
                 this.autoUpdate.isUpdate = true;
            });
        },
        methods: {
            handleLogin(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.isloging = true;
                        this.axios.post("/login.html",this.formData).then((response) => {
                            this.isloging = false;
                            this.iserror = false;
                            if (response.data.result == 1) {
                                this.$store.commit('setToken', this.formData.password);
                                //记住密码
                                if(this.formData.remember)
                                {
                                    this.$store.commit('setUserInfo', {username:this.formData.username,password:this.formData.password});
                                }    
                                else
                                {
                                    this.$store.commit('setUserInfo', {username:'',password:''});
                                }                                                     
                                Hub.$emit('ipcSend','window-main-show');
                                this.$router.push({path:"/ThemeManager"});
                            }
                            else {
                                this.iserror = true;
                                this.errorMsg = response.data.msg;
                            }
                        }).catch(()=>{
                            this.isloging = false;
                            this.iserror = true;
                            this.errorMsg = "网络错误";
                        }); 
                    }
                    else 
                        this.$Message.error('表单验证失败!');
                })
            },
            windowClose () {
                Hub.$emit('ipcSend','window-close');
            },
            windowMinimize() {
                Hub.$emit('ipcSend','window-minimize');
            },
            asyncOK() {
                Hub.$emit('ipcSend','isUpdateNow');
            },
            cancel() {

            }
        }
    }
</script>
