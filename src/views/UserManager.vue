<style scoped>
.layout {
    padding: 10px;
    padding-right:0px;
}
.layout-footer {
    padding: 10px 0px;
    text-align: center;
}
.ivu-card{
    width:240px;
    height:170px;
    float: left;
    margin-right:15px;
    margin-bottom:15px;
}
.ivu-avatar-large{
    width:50px;
    height:50px;
    border-radius: 25px;
}
.centent{
    height:70px;
}
.tooltip-inner1s {
    white-space: normal;
    width:150px;
}
.search{
    margin-bottom: 15px;
    margin-right: 15px;
}
</style>
<template>
    <Layout class="layout">
        <Content :style="{height:tableHeight+'px',overflow: 'auto',padding:'5px',paddingRight:'0px'}">
            <div class="search">
                 <Row>
                    <Col span="8">
                        <Button type="primary" @click="NewEvent" :icon="getBtnIcon">新建用户</Button>                        
                    </Col>
                    <Col span="8" offset="8">
                        <Input v-model="searchVal" @on-enter="searchUser" placeholder="请输入搜索内容...">
                            <Button slot="append" icon="ios-search" @click="searchUser">搜索</Button>
                        </Input>
                    </Col>
                </Row>
            </div>
            <Card :bordered="false" v-for="(item,index) in data" :key="item.name">                           
                <p slot="title" class="hader-titile" style="text-align: right;">                      
                    {{item.nickname}} <a :href="'http://www.twitter.com/' + item.name" target="_blank">@{{item.name}}</a>
                    <Tooltip>
                        <Icon :type="item.is_auth ? 'checkmark-circled' : 'alert-circled'" :style="{color:item.is_auth ? 'green' : 'red'}"></Icon>
                        <div slot="content" :class="item.is_auth ? '' : 'tooltip-inner1s'">
                            {{(item.is_auth) ? '已经通过数据同步检测' : '未通过数据同步检测，暂时不能用于推特，请点击同步'}}   
                        </div>
                    </Tooltip>
                </p>
                <Avatar :src="item.detail.pic" size="large" style="position: absolute; top: 10px;"/>   
                <p class="centent">{{ASCtoText(item.detail.description)}}</p>    
                <p class="btn-group">            
                    <div style="float:left;">
                        <Button :type="item.is_ban ? 'error' : 'success'" shape="circle" size="small" style="position: absolute;top:137px;" @click="setToggle(item,index)" :loading="item.toggleing">
                            {{(item.is_ban) ? '已禁用':'已启用'}}
                        </Button>
                    </div>
                    <div style="float:right;">        
                        <Button type="ghost" shape="circle" size="small" title="修改" icon="compose" ></Button>
                        <Button type="ghost" shape="circle" size="small" title="删除" @click="deleteUser(item.id, index)" icon="ios-trash-outline"></Button>
                        <Button type="ghost" shape="circle" size="small" title="同步" :loading="item.syncing" @click="sycnInfo(item, index)" icon="ios-loop-strong"></Button> 
                    </div>
                </p>
                
            </Card>
        </Content>
        <Footer class="layout-footer"><Page :total="total" size="small" show-total></Page></Footer>
        <Modal v-model="modal_delete" width="260">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>真的要删除这个用户吗？</p>
                <p>Will you delete it?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="ActionDel">删除</Button>
            </div>
        </Modal>
    </Layout>
</template>
<script>
    export default {
        data () {
            return {
                tableHeight : document.documentElement.clientHeight - 135,
                total:0,
                searchVal:'',
                modal_delete:false,
                modal_loading:false,
                data: []
            }
        },
        mounted() {
            const that = this;
            window.onresize = () => {
                that.tableHeight = document.documentElement.clientHeight - 155
            }     
            this.getList();    
        },
        computed: {
            getBtnIcon() {
                var type = this.$route.params.type;
                if (type == "twitter") {
                    return 'social-twitter'
                }
                else if (type == "youtube") {
                    return 'social-youtube'
                }

            }
        },
        methods :{
            getList() {
                var type = this.$route.params.type
                let param = ''
                if (this.searchVal != '') {
                    param += '?name=' + this.searchVal
                }
                this.axios.get("/account/"+type+"/list.html" + param).then((response)=>{
                    this.total = response.data.total;
                    this.data = response.data.datas;
                });
            },
            //新建用户
            NewEvent() {
                var type = this.$route.params.type;
                let win = window.open("#/New/"+type+"User","modal" ,"width=550,height=360,resizable=false");
                var that = this;
                win.onbeforeunload = () => {
                    that.getList();    
                };
                
            },
            //asc转文字
            ASCtoText(str) {
                if(str == null) return "";
                return str.replace(/\\u([0-9a-f]{4})/gi, function (match, grp) {
                    return String.fromCharCode(parseInt(grp, 16));
                });
            },
            //切换启用禁用帐号
            setToggle(item, index) {
                this.$set(this.data[index],'toggleing', true);
                var action = (item.is_ban) ? "enable" : "disabled";                
                this.axios.post("/account/twitter/"+action+".html",{"id":item.id}).then((response)=>{
                    this.$set(this.data[index],'toggleing', false);
                    this.data[index].is_ban = (item.is_ban) ? 0 : 1;
                });
            },
            //同步帐号信息
            sycnInfo(item, index) {                
                this.$set(this.data[index],'syncing', true);
                this.axios.post("/account/twitter/sync.html",{"id":item.id}).then((response)=>{
                    this.$set(this.data[index],'syncing', false);
                    if(response.data.result == 1) {
                        this.$Notice.success({
                            duration:2,
                            title: response.data.msg
                        });
                    }
                    else {
                        this.$Notice.error({
                            duration:2,
                            title: response.data.msg
                        });
                    }                    
                });                
            },
            //删除用户
            deleteUser(id, index) {
                this.modal_delete = true;    
                this.$Modal.id = id;
                this.$Modal.index = index;        
            },
            ActionDel(id, index) {
                this.modal_loading = true;
                this.axios.post("/account/twitter/delete.html",{"id":this.$Modal.id}).then((response)=>{
                    if(response.data.result == 1){
                        this.modal_delete = false;    
                        this.modal_loading = false;
                        this.data.splice(this.$Modal.index, 1);
                    }
                    else 
                        this.$Notice.error({
                            duration:2,
                            title: response.data.msg
                        });                 
                })
            },
            // 更新用户
            updateUser() {
                
            },
            searchUser() {
                this.getList()
            }
        },
        watch: {
            '$route' (to) {
                this.getList()
            }
        }
    }
</script>