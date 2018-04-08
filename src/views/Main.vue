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
    background-color: #222325;
}
.layout-logo{
    width: 180px;
    height: 20px;
    color:darkgrey;
    float: left;
    position: relative;
    top: 10px;
    left: 10px;
}
.layout-button{
    width: 79px;
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
    bottom:25px;
}
</style>
<template>
    <div class="layout">
        <Layout>
            <Header class="noSelectText" style="-webkit-app-region: drag;">
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo">综合舆情管理平台</div>
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
            <Layout>
                <Sider  class="noSelectText" hide-trigger width="107">
                    <NavComponent></NavComponent>
                    <div class="avatar">
                        <Avatar icon="person" size="large" />
                    </div>
                </Sider>
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
    import NavComponent from "./NavComponent.vue"             
    export default {
        data () {
            return {}
        },
        computed :{
            cachePage() {
                return this.$store.state.app.cachePage;
            }           
        },
        methods : {
            windowClose () {
                Hub.$emit('window-close');
            },
            windowMinimize() {
                Hub.$emit('window-minimize');
            }
        },
        components: {
            NavComponent
        },
        watch: {
            '$route' (to) {
                console.info("watch:"+to.name);
                this.$store.commit('setCurrentPageName', to.name);
            }
        }
    }
</script>