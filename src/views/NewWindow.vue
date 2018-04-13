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
    width: 40px;
    margin: 0 auto;
    margin-right: 0px;   
}
.ivu-btn-text,.ivu-btn-text:hover{border-color:none;border:0px;}
.noSelectText {
    -webkit-user-select: none;
}
.avatar {
    position: absolute;  
    left:32%;
    bottom:15px;
}
</style>
<template>
    <div class="layout">
        <Layout>
            <Header class="noSelectText" style="-webkit-app-region: drag;">
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo">新建</div>
                    <div class="layout-button">
                        <ButtonGroup>
                            <Button type="primary" style="color:#FFF;-webkit-app-region: no-drag; border-radius: 0" @click="windowClose">
                                <Icon type="close-round"></Icon>
                            </Button>
                        </ButtonGroup>
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Layout>
                    <Content>
                        <router-view></router-view>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>        
    export default {
        data () {
            return {managerComponent:{}}
        },
        computed :{
            cachePage() {
                return this.$store.state.app.cachePage;
            }           
        },
        methods : {
            windowClose () {
                window.close();
            }
        },
        watch: {
            '$route' (to) {
                console.info("watch:"+to.name);
                this.$store.commit('setCurrentPageName', to.name);
            }
        }
    }
</script>