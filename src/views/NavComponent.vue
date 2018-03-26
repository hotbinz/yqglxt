<style scoped>
.nav{    
    text-align: center;
}
.nav .ivu-menu-item {
    padding: 24px;
}
</style>
<template>
    <Menu theme="dark" :active-name="active" @on-select="menuSelect" class="nav" style="width:100%;">
        <MenuItem name="ThemeManager">
            <Icon type="document-text" size="25"></Icon><br/>
            主题管理
        </MenuItem>
        <MenuItem name="TaskManager">
            <Icon type="information-circled" size="25"></Icon><br/>
            任务管理
        </MenuItem>
        <MenuItem name="UserManager">
            <Icon type="person-stalker" size="25"></Icon><br/>
            帐号管理
        </MenuItem>     
    </Menu>    
</template>
<script>
    export default {
        data () {
            return {
                //theme3: 'dark'
            }
        },
        computed:{
            active() {
                return this.$route.name;
            }
        },
        methods: {
            menuSelect (name) {
                this.$router.push({path:"/" + name});
            }
        }

    }
</script>