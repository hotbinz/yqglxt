<style>
.nav-sub-tabs .ivu-tabs-bar{
    margin-bottom: 0px;
    background-color: #f8f8f9;
}
.nav-sub-tabs .ivu-tabs-nav{
    width:250px;
    margin:auto;
    float:initial;
}
.ivu-table-header .ivu-table-cell{
    padding-left:8px;
    padding-right:8px;
}
</style>
<template>
<div class="layout" style="height:100%;">
    <Tabs class="nav-sub-tabs" :value="active"  @on-click="NavSubSelect">
        <TabPane label="Twitter" name="twitter" icon="social-twitter"></TabPane>
        <TabPane label="Youtube" name="youtube" icon="social-youtube" @on-click="NavSubSelect"></TabPane>
    </Tabs>    
    <router-view></router-view>
</div>
</template>
<script>
    export default {        
        methods :{
            NavSubSelect(name) {
                this.$router.push({path:name});
            }
        },
        computed:{
            active() {
                return this.$route.params.type;
            }
        }
    }
</script>
